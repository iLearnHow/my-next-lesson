# Quantum Lesson Video Generation Setup

## Quick Setup Steps

### 1. Install Dependencies
```bash
npm install tsx dotenv
```

### 2. Create Environment Variables
Add to your `.env` file:
```env
SYNC_API_KEY=your_sync_api_key_here
SYNC_VOICE_ID=your_voice_id_here
SYNC_BASE_URL=https://api.sync.so/v1
```

### 3. Add Script to Your Project
1. Create the file `scripts/generate-quantum-videos.ts` with the TypeScript code above
2. Add to your `package.json` scripts section:
```json
{
  "scripts": {
    "generate-videos": "tsx scripts/generate-quantum-videos.ts"
  }
}
```

### 4. Test the Integration
```bash
# Test with a single video first
npm run generate-videos test

# If test works, generate all 17 videos
npm run generate-videos generate
```

## What This Will Do

### Single Test (`npm run generate-videos test`)
- Creates one 30-second test video
- Saves as `./test-quantum-video.mp4`
- Verifies your API credentials work

### Full Generation (`npm run generate-videos generate`)
- Creates all 17 quantum lesson videos
- Saves to `./quantum-videos/` directory
- Each video named like: `script_1_Intro_Question_1_All_Choices.mp4`
- Creates `generation_summary.json` with results

## Expected Output Structure
```
your-project/
├── quantum-videos/
│   ├── script_1_Intro_Question_1_All_Choices.mp4          (60s)
│   ├── script_2_Question_1_Correct_Feedback.mp4           (35s)
│   ├── script_3_Question_1_Incorrect_Feedback_A.mp4       (30s)
│   ├── script_4_Question_1_Incorrect_Feedback_B.mp4       (30s)
│   ├── script_5_Question_1_Reinforcement.mp4              (20s)
│   ├── script_6_Question_2_Setup_All_Choices.mp4          (45s)
│   ├── script_7_Question_2_Correct_Feedback.mp4           (35s)
│   ├── script_8_Question_2_Incorrect_Feedback_A.mp4       (35s)
│   ├── script_9_Question_2_Incorrect_Feedback_B.mp4       (35s)
│   ├── script_10_Question_2_Reinforcement.mp4             (20s)
│   ├── script_11_Question_3_Setup_All_Choices.mp4         (50s)
│   ├── script_12_Question_3_Correct_Feedback.mp4          (40s)
│   ├── script_13_Question_3_Incorrect_Feedback_A.mp4      (40s)
│   ├── script_14_Question_3_Incorrect_Feedback_B.mp4      (40s)
│   ├── script_15_Question_3_Reinforcement.mp4             (20s)
│   ├── script_16_Fortune_Introduction.mp4                 (5s)
│   ├── script_17_Kellys_3x3x3_Fortune.mp4                (45s)
│   └── generation_summary.json
└── test-quantum-video.mp4
```

## Video Settings

The script automatically configures:
- **Voice**: Your specified voice ID
- **Background**: Professional for lessons, cosmic for fortune
- **Style**: Educational
- **Duration**: Matches your script durations (5s to 60s)
- **Quality**: HD output

## Troubleshooting

### Common Issues:
1. **Missing API credentials**: Check your `.env` file
2. **Rate limiting**: Script includes 2-second delays between requests
3. **Network timeouts**: Script waits up to 5 minutes per video
4. **Download failures**: Videos are re-attempted automatically

### Error Handling:
- Failed videos are logged in `generation_summary.json`
- Script continues if individual videos fail
- Detailed error messages for debugging

## Integration with Your Lesson System

Once generated, you can:
1. Upload videos to your content delivery network
2. Reference them in your lesson UI components
3. Use the `generation_summary.json` to map script IDs to video files
4. Integrate with your existing lesson flow

## Sync.so API Documentation

Make sure to check Sync.so's documentation for:
- Rate limits (adjust delays if needed)
- Available voice IDs
- Background and style options
- Video quality settings

## Next Steps

After generation:
1. Review generated videos for quality
2. Update your lesson components to use video files
3. Consider adding video preloading to your UI
4. Test the full lesson flow with videos