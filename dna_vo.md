# HeyGen Voice-Over Scripts
## DNA Ethics Lesson - June 28, 2025

### **OPENING SCRIPT**
```
Welcome to The Daily Lesson. I'm here to guide you through DNA - the famous blueprint of life, but also at the center of some of society's most complex ethical debates. 

Today, we're exploring genetic science while understanding privacy rights, ethical implications, and the importance of informed consent in biotechnology. We're moving beyond the double helix and asking: who gets to read your blueprint, and what should they be allowed to do with it? 

I have three questions to help you think through the ethics of this powerful code. Let's begin.
```

---

### **QUESTION 1 SETUP**
```
A private company offers a popular at-home DNA testing service that reveals your ancestry and potential health risks. To use the service, you must agree to their terms, which state that they can share your anonymized genetic data with pharmaceutical companies for research. 

What is the most critical ethical issue at play here?
```

### **QUESTION 1 FEEDBACK**

**Correct Answer (Option B - True anonymity & informed consent):**
```
You've hit the core of the problem. True informed consent means you fully understand what you're agreeing to. But the science of de-anonymizing genetic data is advancing rapidly. It might be possible to re-identify individuals from anonymous data, meaning users may be consenting to a much greater loss of privacy than they realize. This is a huge challenge in biotech ethics.
```

**Incorrect Answer A (Ancestry prediction accuracy):**
```
While accuracy is important for the product's quality, it's not the most critical ethical issue. A small error in your ancestry report doesn't have the same societal weight as the potential misuse of your genetic data, which could affect your privacy or even how you are insured or employed in the future.
```

**Incorrect Answer C (Company profit from DNA):**
```
This is a valid concern, and it's part of a larger debate about who owns and profits from biological data. However, the most immediate ethical risk is the potential for misuse of that data. The threat to privacy and the questions around informed consent are more fundamental than the issue of profit.
```

**Reinforcement:**
```
We're looking at what matters most: product accuracy, data privacy and consent, or fairness of profit. In the world of biotech, ensuring that people truly understand and consent to how their fundamental blueprint is used is the most critical ethical foundation.
```

---

### **QUESTION 2 SETUP**
```
A new gene-editing therapy is developed that can eliminate a severe, inherited genetic disease. The therapy is safe and effective. However, it is also extremely expensive, meaning only the wealthiest individuals can afford it. 

What is the primary ethical dilemma this technology creates?
```

### **QUESTION 2 FEEDBACK**

**Correct Answer (Option B - Creating genetic inequality):**
```
Precisely. This is a central question in medical ethics. If life-changing therapies are only available to the wealthy, it could create a society where the rich are not only wealthier, but genetically healthier and free from diseases that still plague the poor. This raises profound questions about justice, fairness, and the kind of society we want to build.
```

**Incorrect Answer A (Long-term side effects):**
```
Safety and long-term effects are an absolutely vital consideration for any new medical treatment. However, the prompt states the therapy is safe and effective. Therefore, the ethical dilemma shifts from safety to the social consequences of its use, and the most immediate consequence here is one of access.
```

**Incorrect Answer C (Playing God concerns):**
```
This is a deep philosophical and religious concern for many people, and it's an important part of the conversation. However, in the context of public policy and medical ethics, the more immediate, practical dilemma is often the question of fairness and access. How do we distribute a proven benefit to society?
```

**Reinforcement:**
```
The issues are: is it safe, is it fair, and is it natural? When a technology is proven safe, the ethical focus must shift to ensuring it benefits all of humanity, not just a select few.
```

---

### **QUESTION 3 SETUP**
```
Your learning objective is to understand the importance of informed consent in biotechnology. A doctor asks a patient to participate in a genetic study. 

Which of the following is the best example of the doctor obtaining truly informed consent?
```

### **QUESTION 3 FEEDBACK**

**Correct Answer (Option B - Clear explanation + questions):**
```
Yes, this is the gold standard. The doctor clearly states the purpose of the study, what will be done with the patient's data, how it will be protected, and explicitly reminds the patient of their right to withdraw. Most importantly, they invite questions, making it a two-way conversation, which is the heart of informed consent.
```

**Incorrect Answer A (Standard procedure):**
```
This is a poor example of informed consent. By saying it's standard procedure and rushing to the signature, the doctor is minimizing the importance of the decision and discouraging questions. Consent given under these circumstances isn't truly informed because the patient hasn't been given the space or information to make a real choice.
```

**Incorrect Answer C (Duty to science):**
```
This is a form of ethical pressure or coercion. While contributing to science can be a good thing, the doctor is using guilt and a sense of duty to persuade the patient. Informed consent must be given freely, without pressure or the feeling that you owe it to someone. The choice must be entirely the patient's.
```

**Reinforcement:**
```
The three approaches are: the rush, the conversation, and the pressure tactic. True informed consent is always a respectful conversation that empowers the individual to make a free and knowledgeable choice.
```

---

### **FORTUNE INTRODUCTION**
```
You just earned your daily fortune...
```

### **FORTUNE OPTIONS**

**Neutral Fortune:**
```
Your genetic code is a story written in a language that science is just beginning to understand. You have the right to decide who gets to read your story and how it is used. Knowledge is power, but consent is control.
```

**Fun Fortune:**
```
You are four percent Neanderthal, twelve percent Viking, and eighty-four percent likely to be annoyed when your phone asks you to agree to terms and conditions you haven't read. Maybe it's time to start reading them?
```

**Grandmother Fortune:**
```
A secret is a precious thing, dear one, and the secrets in your very bones are the most precious of all. Do not let anyone rush you into sharing them. A good decision, like a good soup, needs time to simmer. Make sure you know all the ingredients before you take a taste.
```

---

## **HEYGEN SETUP NOTES**

### **Avatar Specifications:**
- **Style**: Professional educator, approachable but authoritative
- **Tone**: Conversational, thoughtful, engaging
- **Pacing**: Natural speech rhythm with appropriate pauses for reflection
- **Emotion**: Warm but serious when discussing ethical implications

### **Script Timing:**
- **Opening**: ~45 seconds
- **Question Setups**: ~20-25 seconds each
- **Feedback Scripts**: ~30-40 seconds each
- **Reinforcements**: ~15-20 seconds each
- **Fortunes**: ~15-25 seconds each

### **Technical Requirements:**
- **Resolution**: 1920x1080 (16:9) for zen mode compatibility
- **Background**: Transparent or easily replaceable
- **Audio**: High quality for TTS integration
- **Lip Sync**: Optimized for natural speech patterns

### **HeyGen API Integration:**
```javascript
// Example HeyGen API call structure
const generateAvatar = async (script, avatarId) => {
  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'X-API-Key': 'your-api-key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: avatarId
        },
        voice: {
          type: 'text',
          input_text: script
        }
      }]
    })
  });
  return response.json();
};
```

---

## **QUALITY CONTROL CHECKLIST**

### **Content Standards:**
- [ ] All scripts follow Kelly's authentic, conversational tone
- [ ] No group identifiers (students, learners, etc.)
- [ ] One-to-one personal connection maintained
- [ ] Ethical complexity appropriate for general audience
- [ ] Real-world relevance clearly established

### **Technical Standards:**
- [ ] Script length appropriate for attention spans
- [ ] Natural speech rhythm and pacing
- [ ] Clear pronunciation guides for technical terms
- [ ] Appropriate emotional inflection noted
- [ ] Seamless integration with UI timing

### **Educational Standards:**
- [ ] Learning objective clearly addressed
- [ ] Progressive difficulty across three questions
- [ ] All answer choices provide educational value
- [ ] Feedback explains reasoning, not just correctness
- [ ] Fortune connects to lesson themes meaningfully