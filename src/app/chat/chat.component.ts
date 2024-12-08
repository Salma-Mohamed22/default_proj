import { Component, ChangeDetectorRef } from '@angular/core';
import { TokenService } from '../token.service';
import AgoraRTM from 'agora-rtm-sdk';
import AC from 'agora-chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  appId: string = '38fc149915b541c0bf28bc49d731da91';
  userName: string = 'salma';
  channelName: string = '';
  messageText: string = '';
  messages: { memberId: string, text: string | Blob }[] = [];
  client: any;
  channel: any;
  
  conn = new AC.connection({
    appKey: '411253450#1445196',
  });


  // Audio Recording Variables
  isRecording: boolean = false;
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioBlob: Blob | null = null;

  constructor(private tokenService: TokenService, private cdr: ChangeDetectorRef) {}

  // Method to check if the message is audio
  isAudioMessage(msg: any): boolean {
    return msg.text instanceof Blob;
  }

  // Method to get the URL of the audio blob
  getAudioUrl(audioBlob: Blob | any): string {
    return URL.createObjectURL(audioBlob);
  }
  async joinChannel2() {
    const options = {
      user: 'salma',
      agoraToken: '007eJxTYKjhd9hRtqPt2/FlQl52E5YqhQQtanxxVE42bXr/halub1cqMBhbpCUbmlhaGpommZoYJhskpRlZJCWbWKaYGxumJFoa1sWFpDcEMjI4cnAxMjKwMjACIYivwmCZlGhmbG5goJtkkGSua2iYmqabaGFoqWtqnpJqZphklpaYaAgAMrkmLw==',
    };
    this.conn.open(options);

    let option:any = {
      chatType: 'singleChat',
      type: 'txt',
      to: this.channelName,
      msg: this.messageText,
    };
    let msg = AC.message.create(option);
    this.conn.send(msg)
      .then(() => {
        console.log('send private text Success');
      })
      .catch((e) => {
        console.log('Send private text error');
      });
  }
  // async joinChannel() {
  //   if (!this.appId || !this.userName || !this.channelName) {
  //     alert('Please fill in all fields');
  //     console.error('App ID, User Name, and Channel Name are required');
  //     return;
  //   }

  //   try {
  //     // Retrieve the token from the server
  //     const response = await this.tokenService.getToken(this.userName).toPromise();
  //     const token = response?.token;
  //     console.log("token" + token);
  //     console.log('Initializing client...');
  //     this.client = AgoraRTM.createInstance(this.appId);

  //     // Login to the Agora RTM service using the token
  //     // await this.client.login({ token, uid: this.userName });
  //     const options = {
  //       user: 'salma',
  //       agoraToken: '007eJxTYKjhd9hRtqPt2/FlQl52E5YqhQQtanxxVE42bXr/halub1cqMBhbpCUbmlhaGpommZoYJhskpRlZJCWbWKaYGxumJFoa1sWFpDcEMjI4cnAxMjKwMjACIYivwmCZlGhmbG5goJtkkGSua2iYmqabaGFoqWtqnpJqZphklpaYaAgAMrkmLw==',
  //     };
  //     this.conn.open(options);
  //     console.log('Using token:', options.agoraToken);
  //     console.log('Login successful');

  //     this.channel = this.client.createChannel(this.channelName);
  //     await this.channel.join();
  //     console.log(`Joined channel: ${this.channelName}`);

  //     this.channel.on('ChannelMessage', (message: any, memberId: string) => {
  //       console.log('Received message:', message.text);
  //       this.messages.push({ memberId, text: message.text });
  //       this.cdr.detectChanges(); // Manually trigger change detection
  //     });

  //   } catch (error) {
  //     console.error('Error logging in or joining the channel:', error);
  //     alert('Error logging in or joining the channel. Check console for details.');
  //   }
  // }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  // Start recording audio
  startRecording() {
    if (this.isRecording) {
      console.log('Recording is already in progress');
      return;
    }

    console.log('Starting recording...');
    this.isRecording = true;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          console.log('Recording stopped, Blob created');
          this.sendAudioMessage(this.audioBlob);
        };

        this.mediaRecorder.start();
        console.log('Recording started...');
      })
      .catch((error) => {
        console.error('Error starting audio recording:', error);
        alert('Error accessing microphone');
      });
  }

  // Stop recording audio
  stopRecording() {
    if (!this.isRecording) {
      console.log('No recording in progress');
      return;
    }

    this.isRecording = false;
    this.mediaRecorder.stop();
    console.log('Recording stopped');
  }

  // Send audio message
  sendAudioMessage(audioBlob: Blob) {
    const audioFile = new File([audioBlob], 'audioMessage.mp3', { type: 'audio/mp3' });

    this.channel.sendMessage({ text: 'Audio message', file: audioFile })
      .then(() => {
        console.log('Audio message sent');
        this.messages.push({ memberId: this.userName, text: audioFile });
        this.cdr.detectChanges(); // Manually trigger change detection
      })
      .catch((error: any) => {
        console.error('Error sending audio message:', error);
      });
  }

  // Send a text message
  async sendMessage() {
    if (this.messageText.trim() === '') {
      alert('Please enter a message');
      return;
    }

    try {

      await this.channel.sendMessage({ text: this.messageText });
      console.log('Message sent:', this.messageText);
      this.messages.push({ memberId: this.userName, text: this.messageText });
      this.messageText = ''; 
      this.cdr.detectChanges(); // Manually trigger change detection
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
