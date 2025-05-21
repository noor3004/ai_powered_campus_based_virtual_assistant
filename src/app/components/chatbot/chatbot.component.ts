import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: { text: string; sender: "User" | "Bot"; url?: string; imageUrl?: string }[] = [];
  isListening: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  // 🎙️ Start Speech Recognition
  startSpeechRecognition() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    this.isListening = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      this.userMessage = event.results[0][0].transcript.trim();
      this.sendMessage(); // Auto-send recognized speech
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
    };

    recognition.onend = () => {
      this.isListening = false;
    };
  }

  // 📩 Sending message to chatbot
  sendMessage() {
    const trimmedMessage = this.userMessage.trim();
    if (!trimmedMessage) return;

    this.messages.push({ text: trimmedMessage, sender: "User" });
    this.userMessage = ''; // Clear input field immediately

    this.chatbotService.getResponse(trimmedMessage).subscribe(
      (data) => {
        console.log("API Response:", data);
        const botReply = data?.response || "Sorry, I didn't understand that.";

        this.messages.push({
          text: botReply,
          sender: "Bot",
          url: data.url || null,  // ✅ Support for links
          imageUrl: data.imageUrl || null  // ✅ Support for images
        });

        this.speakMessage(botReply);
      },
      (error) => {
        console.error("API Error:", error);
        const errorMessage = "Oops! Something went wrong. Try again.";
        this.messages.push({ text: errorMessage, sender: "Bot" });
        this.speakMessage(errorMessage);
      }
    );
  }

  // 🔊 Convert Text to Speech (TTS)
  speakMessage(message: string) {
    if (!message) return;

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }
}
