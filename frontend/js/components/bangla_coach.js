const BanglaCoachComponent = {
  render: (data) => {
    DOM.setHTML('coachBanglaText', `"${data.coach_bangla}"`);
  },

  playAudio: (text) => {
    if (!('speechSynthesis' in window)) {
      DOM.showToast('Browser does not support Speech Synthesis audio.', 'info');
      return;
    }

    window.speechSynthesis.cancel(); // Reset previous voice queues
    const cleanText = text.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;

    DOM.showToast('সহজ আর্থিক পরামর্শ শুনছেন...', 'info');
    window.speechSynthesis.speak(utterance);
  }
};