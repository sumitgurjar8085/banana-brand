import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Generous body limit for high-res base64 product images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared server-side Gemini client with required User-Agent
const getGeminiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

function parseImageData(dataUriOrBase64: string): { mimeType: string; data: string } {
  if (dataUriOrBase64.includes(';base64,')) {
    const matches = dataUriOrBase64.match(/^data:([a-zA-Z0-9\/\-+.]+);base64,(.+)$/s);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        data: matches[2],
      };
    }
  }
  return {
    mimeType: 'image/png',
    data: dataUriOrBase64,
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    models: ['gemini-3.1-flash-image', 'gemini-3.1-flash-lite-image', 'gemini-3.8-flash'],
  });
});

// Generate Marketing Mockup with Nano Banana consistency
app.post('/api/mockup/generate', async (req, res) => {
  try {
    const {
      image,
      medium,
      mediumName,
      mediumPrompt,
      customPrompt,
      aspectRatio = '1:1',
      modelPreference = 'gemini-3.1-flash-image',
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Product image is required' });
    }

    const ai = getGeminiClient();
    const { mimeType, data: base64Data } = parseImageData(image);

    const promptText = `You are an elite commercial advertising art director and product visualizer.
TASK: Take the product shown in the input image and visualize it seamlessly integrated into this marketing medium:
Marketing Medium: ${mediumName || medium}
Medium Environment & Scene Direction: ${mediumPrompt || ''}
${customPrompt ? `Client Specific Direction: ${customPrompt}` : ''}

CRITICAL NANO BANANA VISUAL CONSISTENCY MANDATES:
1. Strict Brand Identity: Accurately reproduce the exact branding, typography, logo placement, graphic elements, and color palette from the reference product. Ensure the product or its branding is unmistakably recognized.
2. Authentic Material Integration: The branding must conform realistically to the medium's geometry and physical material (e.g. ceramic gloss on a mug, fabric drape on a cotton t-shirt, high-impact backlit scale on a giant billboard).
3. Commercial Lighting & Realism: Photorealistic, cinematic depth of field, natural shadows and ambient reflections matching the scene.
4. Output: Render the completed marketing photograph.`;

    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const selectedRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Model selection strategy: try requested model, fallback if needed
    const candidateModels = [
      modelPreference,
      modelPreference === 'gemini-3.1-flash-image' ? 'gemini-3.1-flash-lite-image' : 'gemini-3.1-flash-image',
    ];

    let generatedImageUrl = '';
    let generationNotes = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        console.log(`Generating mockup with model ${model}, aspect ${selectedRatio}`);
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: selectedRatio as any,
              imageSize: '1K',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const outMime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            generationNotes += part.text;
          }
        }

        if (generatedImageUrl) {
          return res.json({
            success: true,
            imageUrl: generatedImageUrl,
            notes: generationNotes.trim(),
            modelUsed: model,
            aspectRatio: selectedRatio,
          });
        }
      } catch (err: any) {
        console.warn(`Model ${model} attempt failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!generatedImageUrl) {
      throw lastError || new Error('No image was returned from the generative model.');
    }
  } catch (error: any) {
    console.error('Mockup generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate marketing mockup',
      details: error?.toString(),
    });
  }
});

// Edit or refine an existing mockup or image with text prompt
app.post('/api/mockup/edit', async (req, res) => {
  try {
    const {
      image,
      instruction,
      aspectRatio = '1:1',
      modelPreference = 'gemini-3.1-flash-image',
    } = req.body;

    if (!image || !instruction) {
      return res.status(400).json({ error: 'Image and edit instruction are required' });
    }

    const ai = getGeminiClient();
    const { mimeType, data: base64Data } = parseImageData(image);

    const promptText = `You are an expert commercial advertising editor.
Edit the provided marketing image according to these precise creative instructions:
"${instruction}"

IMPORTANT:
- Maintain strict visual consistency with the core product, logo, and brand identity established in the image.
- Apply the requested modifications naturally with realistic lighting, shadows, and textures.`;

    const candidateModels = [
      modelPreference,
      modelPreference === 'gemini-3.1-flash-image' ? 'gemini-3.1-flash-lite-image' : 'gemini-3.1-flash-image',
    ];

    let editedImageUrl = '';
    let notes = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: '1K',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const outMime = part.inlineData.mimeType || 'image/png';
            editedImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            notes += part.text;
          }
        }

        if (editedImageUrl) {
          return res.json({
            success: true,
            imageUrl: editedImageUrl,
            notes: notes.trim(),
            modelUsed: model,
          });
        }
      } catch (err: any) {
        console.warn(`Edit attempt on model ${model} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!editedImageUrl) {
      throw lastError || new Error('No edited image was produced.');
    }
  } catch (error: any) {
    console.error('Edit error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to edit mockup image',
      details: error?.toString(),
    });
  }
});

// AI Brand Consistency Audit between Reference and Generated Mockup
app.post('/api/mockup/audit', async (req, res) => {
  try {
    const { originalImage, mockupImage, mediumName } = req.body;

    if (!originalImage || !mockupImage) {
      return res.status(400).json({ error: 'Both original and mockup images are required for audit' });
    }

    const ai = getGeminiClient();
    const orig = parseImageData(originalImage);
    const mock = parseImageData(mockupImage);

    const auditPrompt = `You are a Chief Brand Officer and Commercial Quality Inspector.
Evaluate the brand consistency between the Original Reference Product (Image 1) and the Generated Marketing Mockup (Image 2) on the medium "${mediumName || 'Marketing Mockup'}".

Analyze:
1. Logo & Typography Integrity: Is the logo accurately rendered, positioned, and legible?
2. Color Palette & Harmony: Are the primary brand colors faithfully preserved?
3. Material & Realistic Physics: Does the product feel integrated into the surface (reflection, curvature, texture)?
4. Overall Consistency Score from 0 to 100.

Return the evaluation in JSON format adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: orig.mimeType,
              data: orig.data,
            },
          },
          {
            inlineData: {
              mimeType: mock.mimeType,
              data: mock.data,
            },
          },
          {
            text: auditPrompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            consistencyScore: {
              type: Type.INTEGER,
              description: 'Overall brand consistency score between 0 and 100',
            },
            brandFidelitySummary: {
              type: Type.STRING,
              description: 'Concise summary of brand element fidelity',
            },
            logoAssessment: {
              type: Type.STRING,
              description: 'Assessment of logo placement, sharpness, and accuracy',
            },
            colorPaletteAssessment: {
              type: Type.STRING,
              description: 'Assessment of color preservation and lighting compatibility',
            },
            materialRealismAssessment: {
              type: Type.STRING,
              description: 'Assessment of surface texture, shadows, and perspective integration',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3 strengths of the mockup',
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1 or 2 actionable refinements',
            },
          },
          required: [
            'consistencyScore',
            'brandFidelitySummary',
            'logoAssessment',
            'colorPaletteAssessment',
            'materialRealismAssessment',
            'strengths',
            'suggestions',
          ],
        },
      },
    });

    const reportJson = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      report: reportJson,
    });
  } catch (error: any) {
    console.error('Audit error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to perform consistency audit',
    });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BananaBrand Studio server running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Server startup error:', err);
});
