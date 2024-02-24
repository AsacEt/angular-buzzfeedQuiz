import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quiz_questions.json'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css', './quizMediaQuery.component.css']
})
export class QuizComponent implements OnInit {

  title:string = ''

  questions:any
  questionSelected:any

  answers:string[] = []
  fastAnswerSelected:string = ''
  answerSelected:string = ''

  questionIndex:number = 0
  questionMaxIndex:number = 0

  finished:boolean = false

  musicPlaying: boolean = true; // Variável para controlar o estado da música

  constructor() {}

  ngOnInit(): void {

    this.adjustVolume(0.1)

    if(quizz_questions){
      this.finished = false
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length

      console.log(this.questionIndex)
      console.log(this.questionMaxIndex)
    }
  }

  adjustVolume(volume: number) {
    const music = document.getElementById('bg-music') as HTMLAudioElement;
    if (music) {
      music.volume = 0.2; // Defina o volume da música
    } else {
      console.error("Elemento de áudio não encontrado!");
    }
  }

  playerChoice(value:string) {
    this.answers.push(value)
    this.nextStep()
    console.log(this.answers)
  }

  async nextStep() {
    this.questionIndex += 1

    if(this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex]
    } else {
      const finalAnswer:string = await this.checkResult(this.answers)

      this.finished = true
      this.fastAnswerSelected = quizz_questions.resultsTitle[finalAnswer as keyof typeof quizz_questions.resultsTitle]
      this.answerSelected = quizz_questions.resultsDesc[finalAnswer as keyof typeof quizz_questions.resultsDesc]
    }
  }

  async checkResult(answers:string[]) {
    ['A', 'B', 'A']
    const result = answers.reduce((previous, current, i, arr) =>{
      if(
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
        ){
          return previous
        } else {
          return current
        }
    })
    return result
  }

  reloadPage() {
    // Adicionei classe de animação
    const button = document.querySelector('.reload-button');
    button?.classList.add('reload-button-animate');

    // Após 0.5 segundos (tempo da animação), vai recarregar a página
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  toggleMusic() {
    const music = document.getElementById('bg-music') as HTMLAudioElement;
    const button = document.getElementById('musicButton') as HTMLButtonElement;
    if (!this.musicPlaying) {
      music.play(); // Toca a música se estiver pausada
      button.innerHTML = '🔊'; // Altera o emoji para 🔊
  } else {
      music.pause(); // Pausa a música se estiver tocando
      button.innerHTML = '🔈'; // Altera o emoji para 🔈
  }
  this.musicPlaying = !this.musicPlaying; // p inverter o estado da música
  }

}
