import firebase from "firebase";
import { makeAutoObservable } from "mobx";

export class Question {
    Id: string;
    English: string;
    Japanese: string;
    LastCollectAnswerd: Date | null;

    constructor(id: string, english: string, japanese: string, lastCollectAnswerd: Date | null) {
        this.Id = id;
        this.English = english;
        this.Japanese = japanese;
        this.LastCollectAnswerd = lastCollectAnswerd;
        makeAutoObservable(this);
    }
    toObject() {
        return ({
            Id: this.Id,
            English: this.English,
            Japanese: this.Japanese,
            LastCollectAnswerd: this.LastCollectAnswerd
        });
    }

}

function getRandomInt(max: number) {
    return Math.round(Math.random() * Math.floor(max));
}

class Hint {
    word: string;
    visible: boolean;
    constructor(word: string) {
        this.word = word;
        this.visible = false;
        makeAutoObservable(this);
    }
}

export class CurrentQuestion {
    question: Question;
    input: string = "";
    hint: Hint[];
    collect: boolean = false;
    constructor(questin: Question) {
        this.question = questin;
        this.hint = questin.English.split(' ').map(word => new Hint(word));
        makeAutoObservable(this);
    }

    get English() {
        return this.question.English;
    }

    get Japanese() {
        return this.question.Japanese;
    }

    check() {
        if (this.input === this.English) {
            this.collect = true;
            return;
        }
        const notVisibleIndex = this.hint.map((word, index) => ({ word, index })).filter(i => !i.word.visible);
        if (notVisibleIndex.length > 0) {
            const nextShowIndex = getRandomInt(notVisibleIndex.length - 1);
            this.hint[notVisibleIndex[nextShowIndex].index].visible = true;
        }
    }
}

export class QuestionService {


    db = firebase.firestore();
    userId: string;
    questions: Question[] = [];
    currentQuestion?: CurrentQuestion;
    constructor(userId: string) {
        this.userId = userId;
        makeAutoObservable(this);
    }

    async load() {
        const data = await this.db.collection('users').doc(this.userId).collection('questions').get();
        const questions: Question[] = []
        data.forEach(q => {
            const d = q.data();
            questions.push(new Question(d.Id, d.English, d.Japanese, d.LastCollectAnswerd?.toDate()));
        });
        this.questions = questions;
        this.currentQuestion = new CurrentQuestion(this.getNextQuestion());
    }

    add() {
        const newDoc = this.db.collection('users').doc(this.userId).collection('questions').doc();
        const newQuestion = new Question(newDoc.id, 'English', 'Japanese', null);
        newDoc.set(newQuestion.toObject());
        this.questions = [...this.questions, newQuestion];
    }

    update(id: string): void {
        const question = this.questions.find(q => q.Id === id);
        if (question) {
            this.db.collection('users').doc(this.userId).collection('questions').doc(id)
                .set(question.toObject());
        }
    }

    getNextQuestion() {
        const next = getRandomInt(this.questions.length - 1);
        return this.questions[next];
    }

    next() {
        if (!this.currentQuestion) {
            this.currentQuestion = new CurrentQuestion(this.getNextQuestion());
            return;
        }
        const questin = this.currentQuestion.question;
        questin.LastCollectAnswerd = new Date();
        this.update(questin.Id);
        this.currentQuestion = new CurrentQuestion(this.getNextQuestion());
    }
}