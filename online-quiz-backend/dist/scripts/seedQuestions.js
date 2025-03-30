"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Question_1 = __importDefault(require("../models/Question"));
dotenv_1.default.config();
const questions = [
    // Level 1
    {
        questionText: "What is the largest country in the world by area?",
        options: ["Russia", "China", "United States", "Canada"],
        correctAnswer: "Russia",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "Which is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: "Canberra",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "Which continent is Egypt located in?",
        options: ["Asia", "Europe", "Africa", "South America"],
        correctAnswer: "Africa",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "What is the smallest independent country in the world?",
        options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
        correctAnswer: "Vatican City",
        level: 1,
        timeLimit: 30,
    },
    {
        questionText: "Which mountain range runs through seven European countries?",
        options: ["Pyrenees", "Alps", "Carpathians", "Apennines"],
        correctAnswer: "Alps",
        level: 1,
        timeLimit: 30,
    },
    //level 2
    {
        questionText: "What is the longest river in the world?",
        options: ["Amazon", "Mississippi", "Nile", "Yangtze"],
        correctAnswer: "Nile",
        level: 2,
        timeLimit: 30,
    },
    {
        questionText: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Korea", "Japan", "Vietnam"],
        correctAnswer: "Japan",
        level: 2,
        timeLimit: 30,
    },
    {
        questionText: "What is the largest desert in the world?",
        options: ["Gobi", "Sahara", "Arabian", "Antarctic"],
        correctAnswer: "Antarctic",
        level: 2,
        timeLimit: 30,
    },
    {
        questionText: "Which country has the most time zones?",
        options: ["Russia", "United States", "France", "China"],
        correctAnswer: "Russia",
        level: 2,
        timeLimit: 30,
    },
    {
        questionText: "What is the capital of Brazil?",
        options: ["Rio de Janeiro", "Sao Paulo", "Brasilia", "Salvador"],
        correctAnswer: "Brasilia",
        level: 2,
        timeLimit: 30,
    },
    //Level 3
    {
        questionText: "Which European country is shaped like a boot?",
        options: ["Greece", "Spain", "Italy", "Portugal"],
        correctAnswer: "Italy",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "What is the deepest point on Earth?",
        options: ["Dead Sea", "Mariana Trench", "Grand Canyon", "Marianas Islands"],
        correctAnswer: "Mariana Trench",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "Which country is home to Machu Picchu?",
        options: ["Bolivia", "Chile", "Ecuador", "Peru"],
        correctAnswer: "Peru",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "What is the official language of Brazil?",
        options: ["Spanish", "Portuguese", "Italian", "French"],
        correctAnswer: "Portuguese",
        level: 3,
        timeLimit: 30,
    },
    {
        questionText: "Which country is the world's largest producer of coffee?",
        options: ["Colombia", "Vietnam", "Indonesia", "Brazil"],
        correctAnswer: "Brazil",
        level: 3,
        timeLimit: 30,
    },
    //Level 4
    {
        questionText: "What is the largest lake in Africa?",
        options: ["Lake Victoria", "Lake Tanganyika", "Lake Chad", "Lake Malawi"],
        correctAnswer: "Lake Victoria",
        level: 4,
        timeLimit: 45,
    },
    {
        questionText: "Which country is known as the Land of Fire and Ice?",
        options: ["Norway", "Finland", "Iceland", "Greenland"],
        correctAnswer: "Iceland",
        level: 4,
        timeLimit: 45,
    },
    {
        questionText: "What is the capital of South Korea?",
        options: ["Busan", "Incheon", "Seoul", "Daegu"],
        correctAnswer: "Seoul",
        level: 4,
        timeLimit: 45,
    },
    {
        questionText: "Which country is the world's largest archipelago?",
        options: ["Philippines", "Greece", "Indonesia", "Japan"],
        correctAnswer: "Indonesia",
        level: 4,
        timeLimit: 45,
    },
    {
        questionText: "What is the highest mountain in North America?",
        options: ["Mount McKinley", "Mount Logan", "Mount Saint Elias", "Mount Whitney"],
        correctAnswer: "Mount McKinley",
        level: 4,
        timeLimit: 45,
    },
    //Level 5
    {
        questionText: "Which African country was formerly known as Abyssinia?",
        options: ["Sudan", "Kenya", "Ethiopia", "Somalia"],
        correctAnswer: "Ethiopia",
        level: 5,
        timeLimit: 45,
    },
    {
        questionText: "What is the smallest continent in the world?",
        options: ["Europe", "Australia", "Antarctica", "South America"],
        correctAnswer: "Australia",
        level: 5,
        timeLimit: 45,
    },
    {
        questionText: "Which country is home to the Great Barrier Reef?",
        options: ["Indonesia", "Philippines", "Australia", "Brazil"],
        correctAnswer: "Australia",
        level: 5,
        timeLimit: 45,
    },
    {
        questionText: "What is the most populous city in Turkey?",
        options: ["Ankara", "Istanbul", "Izmir", "Bursa"],
        correctAnswer: "Istanbul",
        level: 5,
        timeLimit: 45,
    },
    {
        questionText: "Which river runs through Baghdad?",
        options: ["Nile", "Jordan", "Tigris", "Euphrates"],
        correctAnswer: "Tigris",
        level: 5,
        timeLimit: 45,
    },
    //Level 6
    {
        questionText: "What is the largest national park in the United States?",
        options: ["Yellowstone", "Glacier", "Denali", "Wrangell-St. Elias"],
        correctAnswer: "Wrangell-St. Elias",
        level: 6,
        timeLimit: 45,
    },
    {
        questionText: "Which country is the world's largest exporter of diamonds?",
        options: ["South Africa", "Russia", "Botswana", "Australia"],
        correctAnswer: "Russia",
        level: 6,
        timeLimit: 45,
    },
    {
        questionText: "What is the capital of Kazakhstan?",
        options: ["Almaty", "Astana", "Nur-Sultan", "Shymkent"],
        correctAnswer: "Nur-Sultan",
        level: 6,
        timeLimit: 45,
    },
    {
        questionText: "Which sea is located between Europe and Africa?",
        options: ["Baltic Sea", "Mediterranean Sea", "Red Sea", "Black Sea"],
        correctAnswer: "Mediterranean Sea",
        level: 6,
        timeLimit: 45,
    },
    {
        questionText: "What is the highest waterfall in the world?",
        options: ["Niagara Falls", "Victoria Falls", "Angel Falls", "Iguazu Falls"],
        correctAnswer: "Angel Falls",
        level: 6,
        timeLimit: 45,
    },
    //Level 7
    {
        questionText: "Which country is the world's largest producer of chocolate?",
        options: ["Belgium", "Switzerland", "Germany", "United States"],
        correctAnswer: "Switzerland",
        level: 7,
        timeLimit: 60,
    },
    {
        questionText: "What is the official currency of Japan?",
        options: ["Yuan", "Won", "Yen", "Ringgit"],
        correctAnswer: "Yen",
        level: 7,
        timeLimit: 60,
    },
    {
        questionText: "Which country is home to the ancient city of Petra?",
        options: ["Egypt", "Jordan", "Syria", "Iraq"],
        correctAnswer: "Jordan",
        level: 7,
        timeLimit: 60,
    },
    {
        questionText: "What is the largest island in the Caribbean?",
        options: ["Cuba", "Haiti", "Jamaica", "Dominican Republic"],
        correctAnswer: "Cuba",
        level: 7,
        timeLimit: 60,
    },
    {
        questionText: "Which mountain is the tallest in the European Union?",
        options: ["Mont Blanc", "Mount Etna", "Mount Vesuvius", "Matterhorn"],
        correctAnswer: "Mont Blanc",
        level: 7,
        timeLimit: 60,
    },
    //Level 8
    {
        questionText: "What is the capital of New Zealand?",
        options: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
        correctAnswer: "Wellington",
        level: 8,
        timeLimit: 60,
    },
    {
        questionText: "Which country has the most natural lakes?",
        options: ["United States", "Russia", "Canada", "Finland"],
        correctAnswer: "Canada",
        level: 8,
        timeLimit: 60,
    },
    {
        questionText: "What is the driest place on Earth?",
        options: ["Sahara Desert", "Arabian Desert", "Atacama Desert", "Antarctica"],
        correctAnswer: "Atacama Desert",
        level: 8,
        timeLimit: 60,
    },
    {
        questionText: "Which country is home to Angkor Wat?",
        options: ["Vietnam", "Thailand", "Cambodia", "Laos"],
        correctAnswer: "Cambodia",
        level: 8,
        timeLimit: 60,
    },
    {
        questionText: "What is the southernmost continent?",
        options: ["South America", "Australia", "Antarctica", "Africa"],
        correctAnswer: "Antarctica",
        level: 8,
        timeLimit: 60,
    },
    // Level 9
    {
        questionText: "Which river flows through Paris?",
        options: ["Rhine", "Thames", "Seine", "Danube"],
        correctAnswer: "Seine",
        level: 9,
        timeLimit: 60,
    },
    {
        questionText: "What is the largest lake in South America?",
        options: ["Lake Titicaca", "Lake Maracaibo", "Lake Valencia", "Lake Buenos Aires"],
        correctAnswer: "Lake Titicaca",
        level: 9,
        timeLimit: 60,
    },
    {
        questionText: "Which country is the world's largest producer of rice?",
        options: ["India", "China", "Indonesia", "Vietnam"],
        correctAnswer: "China",
        level: 9,
        timeLimit: 60,
    },
    {
        questionText: "What is the capital of Morocco?",
        options: ["Casablanca", "Marrakech", "Rabat", "Fez"],
        correctAnswer: "Rabat",
        level: 9,
        timeLimit: 60,
    },
    {
        questionText: "Which desert covers much of Northern Africa?",
        options: ["Kalahari", "Arabian", "Gobi", "Sahara"],
        correctAnswer: "Sahara",
        level: 9,
        timeLimit: 60,
    },
    //Level 10
    {
        questionText: "What is the longest river in Africa?",
        options: ["Congo", "Niger", "Zambezi", "Nile"],
        correctAnswer: "Nile",
        level: 10,
        timeLimit: 60,
    },
    {
        questionText: "Which country is home to the city of Timbuktu?",
        options: ["Senegal", "Mali", "Niger", "Chad"],
        correctAnswer: "Mali",
        level: 10,
        timeLimit: 60,
    },
    {
        questionText: "What is the smallest ocean in the world?",
        options: ["Arctic Ocean", "Southern Ocean", "Indian Ocean", "Atlantic Ocean"],
        correctAnswer: "Arctic Ocean",
        level: 10,
        timeLimit: 60,
    },
    {
        questionText: "Which country is the world's largest producer of olive oil?",
        options: ["Greece", "Italy", "Spain", "Turkey"],
        correctAnswer: "Spain",
        level: 10,
        timeLimit: 60,
    },
    {
        questionText: "What is the official language of Argentina?",
        options: ["Portuguese", "Italian", "Spanish", "French"],
        correctAnswer: "Spanish",
        level: 10,
        timeLimit: 60,
    },
    //Level 11
    {
        questionText: "Which country is home to the ancient city of Troy?",
        options: ["Greece", "Italy", "Turkey", "Syria"],
        correctAnswer: "Turkey",
        level: 11,
        timeLimit: 999999,
    },
    {
        questionText: "What is the most populous city in Canada?",
        options: ["Vancouver", "Montreal", "Toronto", "Calgary"],
        correctAnswer: "Toronto",
        level: 11,
        timeLimit: 999999,
    },
    {
        questionText: "Which mountain range separates Europe and Asia?",
        options: ["Pyrenees", "Alps", "Ural Mountains", "Carpathians"],
        correctAnswer: "Ural Mountains",
        level: 11,
        timeLimit: 999999,
    },
    {
        questionText: "What is the capital of Chile?",
        options: ["Lima", "Buenos Aires", "Santiago", "Montevideo"],
        correctAnswer: "Santiago",
        level: 11,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is the world's largest producer of bananas?",
        options: ["Brazil", "India", "Ecuador", "Philippines"],
        correctAnswer: "India",
        level: 11,
        timeLimit: 999999,
    },
    //Level 12
    {
        questionText: "What is the official language of Switzerland?",
        options: ["German", "French", "Italian", "All of the above"],
        correctAnswer: "All of the above",
        level: 12,
        timeLimit: 999999,
    },
    {
        questionText: "Which river is the longest in South America?",
        options: ["Orinoco", "Amazon", "Parana", "Uruguay"],
        correctAnswer: "Amazon",
        level: 12,
        timeLimit: 999999,
    },
    {
        questionText: "What is the oldest city in the world?",
        options: ["Damascus", "Jericho", "Jerusalem", "Aleppo"],
        correctAnswer: "Jericho",
        level: 12,
        timeLimit: 999999,
    },
    {
        questionText: "Which country has the most UNESCO World Heritage Sites?",
        options: ["Greece", "Italy", "France", "Spain"],
        correctAnswer: "Italy",
        level: 12,
        timeLimit: 999999,
    },
    {
        questionText: "What is the largest lake in North America?",
        options: ["Great Bear Lake", "Great Slave Lake", "Lake Superior", "Lake Michigan"],
        correctAnswer: "Lake Superior",
        level: 12,
        timeLimit: 999999,
    },
    //Level 13
    {
        questionText: "Which country is the world's largest producer of tea?",
        options: ["India", "China", "Kenya", "Sri Lanka"],
        correctAnswer: "China",
        level: 13,
        timeLimit: 999999,
    },
    {
        questionText: "What is the capital of Peru?",
        options: ["Cusco", "Lima", "Arequipa", "Trujillo"],
        correctAnswer: "Lima",
        level: 13,
        timeLimit: 999999,
    },
    {
        questionText: "Which sea is located between Greece and Turkey?",
        options: ["Adriatic Sea", "Aegean Sea", "Ionian Sea", "Mediterranean Sea"],
        correctAnswer: "Aegean Sea",
        level: 13,
        timeLimit: 999999,
    },
    {
        questionText: "What is the largest national park in Canada?",
        options: ["Banff", "Jasper", "Wood Buffalo", "Glacier"],
        correctAnswer: "Wood Buffalo",
        level: 13,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is home to the Dead Sea?",
        options: ["Syria", "Jordan", "Israel", "Both Israel and Jordan"],
        correctAnswer: "Both Israel and Jordan",
        level: 13,
        timeLimit: 999999,
    },
    //Level 14
    {
        questionText: "What is the most populous city in South Africa?",
        options: ["Cape Town", "Durban", "Johannesburg", "Pretoria"],
        correctAnswer: "Johannesburg",
        level: 14,
        timeLimit: 999999,
    },
    {
        questionText: "Which river runs through Baghdad?",
        options: ["Nile", "Jordan", "Tigris", "Euphrates"],
        correctAnswer: "Tigris",
        level: 14,
        timeLimit: 999999,
    },
    {
        questionText: "What is the largest island in the Mediterranean Sea?",
        options: ["Sardinia", "Corsica", "Sicily", "Crete"],
        correctAnswer: "Sicily",
        level: 14,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is the world's largest producer of sugar?",
        options: ["India", "Brazil", "China", "Thailand"],
        correctAnswer: "Brazil",
        level: 14,
        timeLimit: 999999,
    },
    {
        questionText: "What is the capital of Mongolia?",
        options: ["Erdenet", "Darkhan", "Ulaanbaatar", "Choibalsan"],
        correctAnswer: "Ulaanbaatar",
        level: 14,
        timeLimit: 999999,
    },
    //Level 15
    {
        questionText: "Which mountain is the tallest in Africa?",
        options: ["Mount Kenya", "Mount Kilimanjaro", "Mount Elgon", "Mount Meru"],
        correctAnswer: "Mount Kilimanjaro",
        level: 15,
        timeLimit: 999999,
    },
    {
        questionText: "What is the longest river in Europe?",
        options: ["Rhine", "Danube", "Volga", "Ural"],
        correctAnswer: "Volga",
        level: 15,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is home to the Galapagos Islands?",
        options: ["Peru", "Colombia", "Ecuador", "Chile"],
        correctAnswer: "Ecuador",
        level: 15,
        timeLimit: 999999,
    },
    {
        questionText: "What is the largest lake in Europe?",
        options: ["Lake Ladoga", "Lake Onega", "Lake Balkhash", "Lake Baikal"],
        correctAnswer: "Lake Ladoga",
        level: 15,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is the world's largest producer of natural rubber?",
        options: ["Thailand", "Indonesia", "Malaysia", "China"],
        correctAnswer: "Thailand",
        level: 15,
        timeLimit: 999999,
    },
    //Level 16
    {
        questionText: "What is the capital of Croatia?",
        options: ["Split", "Dubrovnik", "Zagreb", "Rijeka"],
        correctAnswer: "Zagreb",
        level: 16,
        timeLimit: 999999,
    },
    {
        questionText: "Which desert is the largest hot desert in the world?",
        options: ["Arabian Desert", "Gobi Desert", "Kalahari Desert", "Sahara Desert"],
        correctAnswer: "Sahara Desert",
        level: 16,
        timeLimit: 999999,
    },
    {
        questionText: "What is the deepest lake in the world?",
        options: ["Lake Tanganyika", "Lake Baikal", "Lake Superior", "Lake Michigan"],
        correctAnswer: "Lake Baikal",
        level: 16,
        timeLimit: 999999,
    },
    {
        questionText: "Which country is home to the Great Wall?",
        options: ["Japan", "Korea", "China", "Mongolia"],
        correctAnswer: "China",
        level: 16,
        timeLimit: 999999,
    },
    {
        questionText: "What is the largest city in South Korea?",
        options: ["Busan", "Incheon", "Seoul", "Daegu"],
        correctAnswer: "Seoul",
        level: 16,
        timeLimit: 999999,
    }
];
const seedQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        yield Question_1.default.deleteMany(); // Clear existing questions
        console.log('Existing questions cleared');
        yield Question_1.default.insertMany(questions); // Insert new questions
        console.log('Questions seeded successfully');
        process.exit();
    }
    catch (error) {
        console.error('Error seeding questions:', error);
        process.exit(1);
    }
});
seedQuestions();
