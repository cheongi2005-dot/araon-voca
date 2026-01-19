import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 데이터 정의
const DAY_TITLES = {
  1: "설레는 학교 생활", 2: "맛있는 음식과 간식", 3: "우리 가족과 집", 
  4: "귀여운 동물 친구들", 5: "아름다운 색깔과 자연", 6: "우리 몸 구석구석", 
  7: "숫자와 순서 세기", 8: "시간과 하루의 흐름", 9: "모양과 상태 설명하기", 
  10: "즐거운 몸동작", 11: "우리 주변 물건들", 12: "붕붕! 여러 가지 교통수단", 
  13: "멋지게 옷 입기", 14: "매일매일 나의 하루", 15: "이웃 사람들과 직업", 
  16: "자연 속 풍경 탐험", 17: "더 풍성해진 식탁", 18: "우리 집 구석구석", 
  19: "사계절과 변화무쌍 날씨", 20: "반대말 찾기 놀이", 21: "느끼고 생각하기", 
  22: "서로 돕고 말해요", 23: "요일과 달력 보기", 24: "문화 생활과 도구", 
  25: "우리가 사는 지구촌", 26: "여러 가지 모양과 위치", 27: "수량과 범위 나타내기", 
  28: "언제, 얼마나 자주?", 29: "위치와 방향 알려주기", 30: "꼭 필요한 생활 표현"
};
const DATA_BY_DAY = {
      1: [
        { word: "Hello", meaning: "안녕", sentence: "___, how are you?", emoji: "👋" },
        { word: "Name", meaning: "이름", sentence: "My ___ is Tom.", emoji: "📛" },
        { word: "School", meaning: "학교", sentence: "I like my ___.", emoji: "🏫" },
        { word: "Teacher", meaning: "선생님", sentence: "The ___ is kind.", emoji: "🧑‍🏫" },
        { word: "Student", meaning: "학생", sentence: "I am a ___.", emoji: "🧑‍🎓" },
        { word: "Book", meaning: "책", sentence: "Read this ___.", emoji: "📖" },
        { word: "Pencil", meaning: "연필", sentence: "Use a ___.", emoji: "✏️" },
        { word: "Desk", meaning: "책상", sentence: "On the ___.", emoji: "📚" },
        { word: "Chair", meaning: "의자", sentence: "Sit on the ___.", emoji: "🪑" },
        { word: "Class", meaning: "수업, 반", sentence: "Our ___ is fun.", emoji: "📋" }
      ],
      2: [
        { word: "Apple", meaning: "사과", sentence: "Red ___.", emoji: "🍎" },
        { word: "Banana", meaning: "바나나", sentence: "Yellow ___.", emoji: "🍌" },
        { word: "Orange", meaning: "오렌지", sentence: "Sweet ___.", emoji: "🍊" },
        { word: "Water", meaning: "물", sentence: "Drink ___.", emoji: "💧" },
        { word: "Milk", meaning: "우유", sentence: "Cold ___.", emoji: "🥛" },
        { word: "Bread", meaning: "빵", sentence: "Eat ___.", emoji: "🍞" },
        { word: "Rice", meaning: "밥, 쌀", sentence: "White ___.", emoji: "🍚" },
        { word: "Egg", meaning: "달걀", sentence: "A fresh ___.", emoji: "🥚" },
        { word: "Cake", meaning: "케이크", sentence: "Birthday ___.", emoji: "🍰" },
        { word: "Juice", meaning: "주스", sentence: "Apple ___.", emoji: "🍹" }
      ],
      3: [
        { word: "Father", meaning: "아버지", sentence: "My ___.", emoji: "👨" },
        { word: "Mother", meaning: "어머니", sentence: "My ___.", emoji: "👩" },
        { word: "Brother", meaning: "형제, 남동생", sentence: "My ___.", emoji: "👦" },
        { word: "Sister", meaning: "자매, 여동생", sentence: "My ___.", emoji: "👧" },
        { word: "Family", meaning: "가족", sentence: "I love my ___.", emoji: "👨‍👩‍👧‍👦" },
        { word: "House", meaning: "집", sentence: "A big ___.", emoji: "🏠" },
        { word: "Room", meaning: "방", sentence: "My ___.", emoji: "🛌" },
        { word: "Bed", meaning: "침대", sentence: "Go to ___.", emoji: "🛏️" },
        { word: "Door", meaning: "문", sentence: "Open the ___.", emoji: "🚪" },
        { word: "Friend", meaning: "친구", sentence: "Best ___.", emoji: "🤝" }
      ],
      4: [
        { word: "Dog", meaning: "개", sentence: "The ___ barks.", emoji: "🐶" },
        { word: "Cat", meaning: "고양이", sentence: "The ___ sleeps.", emoji: "🐱" },
        { word: "Bird", meaning: "새", sentence: "The ___ flies.", emoji: "🐦" },
        { word: "Fish", meaning: "물고기", sentence: "The ___ swims.", emoji: "🐟" },
        { word: "Pig", meaning: "돼지", sentence: "Pink ___.", emoji: "🐷" },
        { word: "Cow", meaning: "소", sentence: "The ___ says moo.", emoji: "🐮" },
        { word: "Horse", meaning: "말", sentence: "Ride a ___.", emoji: "🐴" },
        { word: "Rabbit", meaning: "토끼", sentence: "Cute ___.", emoji: "🐰" },
        { word: "Lion", meaning: "사자", sentence: "The ___ roars.", emoji: "🦁" },
        { word: "Tiger", meaning: "호랑이", sentence: "Strong ___.", emoji: "🐯" }
      ],
      5: [
        { word: "Red", meaning: "빨간색", sentence: "It is ___.", emoji: "🔴" },
        { word: "Blue", meaning: "파란색", sentence: "It is ___.", emoji: "🔵" },
        { word: "Green", meaning: "초록색", sentence: "It is ___.", emoji: "🟢" },
        { word: "Yellow", meaning: "노란색", sentence: "It is ___.", emoji: "🟡" },
        { word: "Black", meaning: "검은색", sentence: "It is ___.", emoji: "⚫" },
        { word: "White", meaning: "하얀색", sentence: "It is ___.", emoji: "⚪" },
        { word: "Sky", meaning: "하늘", sentence: "Blue ___.", emoji: "☁️" },
        { word: "Sun", meaning: "태양", sentence: "The ___ shines.", emoji: "☀️" },
        { word: "Moon", meaning: "달", sentence: "The ___ is up.", emoji: "🌙" },
        { word: "Star", meaning: "별", sentence: "Bright ___.", emoji: "⭐" }
      ],
      6: [
        { word: "Head", meaning: "머리", sentence: "Touch your ___.", emoji: "🙆" },
        { word: "Eye", meaning: "눈", sentence: "Close your ___s.", emoji: "👁️" },
        { word: "Nose", meaning: "코", sentence: "My ___.", emoji: "👃" },
        { word: "Mouth", meaning: "입", sentence: "Open your ___.", emoji: "👄" },
        { word: "Ear", meaning: "귀", sentence: "Wash your ___s.", emoji: "👂" },
        { word: "Hand", meaning: "손", sentence: "Shake ___s.", emoji: "✋" },
        { word: "Foot", meaning: "발", sentence: "Left ___.", emoji: "🦶" },
        { word: "Arm", meaning: "팔", sentence: "Long ___.", emoji: "💪" },
        { word: "Leg", meaning: "다리", sentence: "Strong ___.", emoji: "🦵" },
        { word: "Body", meaning: "몸", sentence: "Healthy ___.", emoji: "👤" }
      ],
      7: [
        { word: "One", meaning: "하나, 1", sentence: "Number ___.", emoji: "1️⃣" },
        { word: "Two", meaning: "둘, 2", sentence: "Number ___.", emoji: "2️⃣" },
        { word: "Three", meaning: "셋, 3", sentence: "A triangle has ___ sides.", emoji: "3️⃣" },
        { word: "Four", meaning: "넷, 4", sentence: "A car has ___ wheels.", emoji: "4️⃣" },
        { word: "Five", meaning: "다섯, 5", sentence: "I have ___ fingers.", emoji: "5️⃣" },
        { word: "Six", meaning: "여섯, 6", sentence: "An insect has ___ legs.", emoji: "6️⃣" },
        { word: "Seven", meaning: "일곱, 7", sentence: "There are ___ days in a week.", emoji: "7️⃣" },
        { word: "Eight", meaning: "여덟, 8", sentence: "An octopus has ___ arms.", emoji: "8️⃣" },
        { word: "Nine", meaning: "아홉, 9", sentence: "I am ___ years old.", emoji: "9️⃣" },
        { word: "Ten", meaning: "열, 10", sentence: "Count from one to ___.", emoji: "🔟" }
      ],
      8: [
        { word: "Morning", meaning: "아침", sentence: "In the ___.", emoji: "🌅" },
        { word: "Afternoon", meaning: "오후", sentence: "In the ___.", emoji: "🌤️" },
        { word: "Evening", meaning: "저녁", sentence: "In the ___.", emoji: "🌆" },
        { word: "Night", meaning: "밤", sentence: "At ___.", emoji: "🌃" },
        { word: "Day", meaning: "날", sentence: "Nice ___.", emoji: "📅" },
        { word: "Time", meaning: "시간", sentence: "What ___?", emoji: "⏰" },
        { word: "Clock", meaning: "시계", sentence: "Wall ___.", emoji: "🕰️" },
        { word: "Today", meaning: "오늘", sentence: "___ is Monday.", emoji: "☀️" },
        { word: "Tomorrow", meaning: "내일", sentence: "See you ___.", emoji: "🔜" },
        { word: "Year", meaning: "년, 해", sentence: "New ___.", emoji: "🗓️" }
      ],
      9: [
        { word: "Good", meaning: "좋은", sentence: "___ boy.", emoji: "👍" },
        { word: "Bad", meaning: "나쁜", sentence: "___ habit.", emoji: "👎" },
        { word: "Happy", meaning: "행복한", sentence: "I am ___.", emoji: "😊" },
        { word: "Sad", meaning: "슬픈", sentence: "Don't be ___.", emoji: "😢" },
        { word: "Big", meaning: "큰", sentence: "___ box.", emoji: "🐘" },
        { word: "Small", meaning: "작은", sentence: "___ toy.", emoji: "🐜" },
        { word: "Tall", meaning: "키가 큰", sentence: "___ tree.", emoji: "🦒" },
        { word: "Short", meaning: "짧은, 키가 작은", sentence: "___ hair.", emoji: "🐁" },
        { word: "Hot", meaning: "더운, 뜨거운", sentence: "___ water.", emoji: "♨️" },
        { word: "Cold", meaning: "추운, 차가운", sentence: "___ ice.", emoji: "❄️" }
      ],
      10: [
        { word: "Go", meaning: "가다", sentence: "___ home.", emoji: "🚶" },
        { word: "Come", meaning: "오다", sentence: "___ here.", emoji: "🏃" },
        { word: "Sit", meaning: "앉다", sentence: "___ down.", emoji: "🪑" },
        { word: "Stand", meaning: "서다", sentence: "___ up.", emoji: "🧍" },
        { word: "Run", meaning: "달리다", sentence: "___ fast.", emoji: "👟" },
        { word: "Walk", meaning: "걷다", sentence: "___ slowly.", emoji: "👣" },
        { word: "Jump", meaning: "뛰다", sentence: "___ high.", emoji: "🦘" },
        { word: "Play", meaning: "놀다", sentence: "___ soccer.", emoji: "⚽" },
        { word: "Sing", meaning: "노래하다", sentence: "___ a song.", emoji: "🎤" },
        { word: "Dance", meaning: "춤추다", sentence: "Let's ___.", emoji: "💃" }
      ],
      11: [
        { word: "Box", meaning: "상자", sentence: "In the ___.", emoji: "📦" },
        { word: "Ball", meaning: "공", sentence: "Play ___.", emoji: "🏀" },
        { word: "Doll", meaning: "인형", sentence: "Pretty ___.", emoji: "🧸" },
        { word: "Game", meaning: "게임", sentence: "Fun ___.", emoji: "🎮" },
        { word: "Toy", meaning: "장난감", sentence: "My ___.", emoji: "🪀" },
        { word: "Tree", meaning: "나무", sentence: "Green ___.", emoji: "🌳" },
        { word: "Flower", meaning: "꽃", sentence: "Red ___.", emoji: "🌻" },
        { word: "Grass", meaning: "풀", sentence: "Green ___.", emoji: "🌱" },
        { word: "Park", meaning: "공원", sentence: "At the ___.", emoji: "🏞️" },
        { word: "Hill", meaning: "언덕", sentence: "Up the ___.", emoji: "⛰️" }
      ],
      12: [
        { word: "Bus", meaning: "버스", sentence: "Take a ___.", emoji: "🚌" },
        { word: "Car", meaning: "자동차", sentence: "Dad's ___.", emoji: "🚗" },
        { word: "Bike", meaning: "자전거", sentence: "Ride a ___.", emoji: "🚲" },
        { word: "Train", meaning: "기차", sentence: "Long ___.", emoji: "🚂" },
        { word: "Boat", meaning: "배", sentence: "On a ___.", emoji: "⛵" },
        { word: "Plane", meaning: "비행기", sentence: "Fast ___.", emoji: "✈️" },
        { word: "Street", meaning: "거리", sentence: "On the ___.", emoji: "🚥" },
        { word: "Road", meaning: "도로", sentence: "Wide ___.", emoji: "🛣️" },
        { word: "Map", meaning: "지도", sentence: "Look at the ___.", emoji: "🗺️" },
        { word: "Way", meaning: "길", sentence: "Right ___.", emoji: "📍" }
      ],
      13: [
        { word: "Hat", meaning: "모자", sentence: "Wear a ___.", emoji: "👒" },
        { word: "Shirt", meaning: "셔츠", sentence: "Clean ___.", emoji: "👕" },
        { word: "Pants", meaning: "바지", sentence: "Blue ___.", emoji: "👖" },
        { word: "Dress", meaning: "드레스", sentence: "New ___.", emoji: "👗" },
        { word: "Shoes", meaning: "신발", sentence: "My ___.", emoji: "👟" },
        { word: "Socks", meaning: "양말", sentence: "White ___.", emoji: "🧦" },
        { word: "Coat", meaning: "코트", sentence: "Warm ___.", emoji: "🧥" },
        { word: "Cap", meaning: "모자", sentence: "Baseball ___.", emoji: "🧢" },
        { word: "Wear", meaning: "입다, 쓰다", sentence: "___ shoes.", emoji: "👚" },
        { word: "Wash", meaning: "씻다", sentence: "___ hands.", emoji: "🧺" }
      ],
      14: [
        { word: "Eat", meaning: "먹다", sentence: "___ bread.", emoji: "🍴" },
        { word: "Drink", meaning: "마시다", sentence: "___ milk.", emoji: "🥤" },
        { word: "Sleep", meaning: "자다", sentence: "___ well.", emoji: "💤" },
        { word: "Wake", meaning: "깨다", sentence: "___ up.", emoji: "🔔" },
        { word: "Wash", meaning: "씻다", sentence: "___ face.", emoji: "🧼" },
        { word: "Brush", meaning: "닦다", sentence: "___ teeth.", emoji: "🪥" },
        { word: "Read", meaning: "읽다", sentence: "___ books.", emoji: "📖" },
        { word: "Write", meaning: "쓰다", sentence: "___ names.", emoji: "✍️" },
        { word: "Draw", meaning: "그리다", sentence: "___ birds.", emoji: "🎨" },
        { word: "Speak", meaning: "말하다", sentence: "___ English.", emoji: "🗣️" }
      ],
      15: [
        { word: "Baby", meaning: "아기", sentence: "Cute ___.", emoji: "👶" },
        { word: "Boy", meaning: "소년", sentence: "Tall ___.", emoji: "👦" },
        { word: "Girl", meaning: "소녀", sentence: "Pretty ___.", emoji: "👧" },
        { word: "Man", meaning: "남자", sentence: "Strong ___.", emoji: "👨" },
        { word: "Woman", meaning: "여자", sentence: "Kind ___.", emoji: "👩" },
        { word: "King", meaning: "왕", sentence: "Old ___.", emoji: "👑" },
        { word: "Queen", meaning: "여왕", sentence: "Beautiful ___.", emoji: "👸" },
        { word: "Doctor", meaning: "의사", sentence: "See a ___.", emoji: "🩺" },
        { word: "Nurse", meaning: "간호사", sentence: "Kind ___.", emoji: "🩹" },
        { word: "Police", meaning: "경찰", sentence: "Call the ___.", emoji: "👮" }
      ],
      16: [
        { word: "Farm", meaning: "농장", sentence: "Animal ___.", emoji: "🚜" },
        { word: "Zoo", meaning: "동물원", sentence: "At the ___.", emoji: "🦁" },
        { word: "Forest", meaning: "숲", sentence: "Dark ___.", emoji: "🌲" },
        { word: "Sea", meaning: "바다", sentence: "Blue ___.", emoji: "🌊" },
        { word: "Beach", meaning: "해변", sentence: "On the ___.", emoji: "🏖️" },
        { word: "Mountain", meaning: "산", sentence: "High ___.", emoji: "🏔️" },
        { word: "River", meaning: "강", sentence: "Long ___.", emoji: "🏞️" },
        { word: "Lake", meaning: "호수", sentence: "Calm ___.", emoji: "🛶" },
        { word: "Star", meaning: "별", sentence: "Bright ___.", emoji: "🌟" },
        { word: "Rain", meaning: "비", sentence: "Cold ___.", emoji: "🌧️" }
      ],
      17: [
        { word: "Bread", meaning: "빵", sentence: "Eat ___.", emoji: "🥖" },
        { word: "Juice", meaning: "주스", sentence: "Orange ___.", emoji: "🍷" },
        { word: "Honey", meaning: "꿀", sentence: "Sweet ___.", emoji: "🍯" },
        { word: "Salt", meaning: "소금", sentence: "White ___.", emoji: "🧂" },
        { word: "Sugar", meaning: "설탕", sentence: "Sweet ___.", emoji: "🍬" },
        { word: "Soup", meaning: "수프", sentence: "Hot ___.", emoji: "🥣" },
        { word: "Meat", meaning: "고기", sentence: "Red ___.", emoji: "🥩" },
        { word: "Fish", meaning: "생선", sentence: "Fresh ___.", emoji: "🍱" },
        { word: "Pizza", meaning: "피자", sentence: "Like ___.", emoji: "🍕" },
        { word: "Snack", meaning: "간식", sentence: "Want a ___.", emoji: "🍪" }
      ],
      18: [
        { word: "Kitchen", meaning: "주방", sentence: "In the ___.", emoji: "🍳" },
        { word: "Bath", meaning: "목욕", sentence: "Take a ___.", emoji: "🛁" },
        { word: "Toilet", meaning: "화장실", sentence: "Where is ___?", emoji: "🚽" },
        { word: "Window", meaning: "창문", sentence: "Open the ___.", emoji: "🪟" },
        { word: "Wall", meaning: "벽", sentence: "White ___.", emoji: "🧱" },
        { word: "Floor", meaning: "바닥", sentence: "On the ___.", emoji: "🧹" },
        { word: "Garden", meaning: "정원", sentence: "In the ___.", emoji: "🏡" },
        { word: "Yard", meaning: "마당", sentence: "In the ___.", emoji: "🍀" },
        { word: "Key", meaning: "열쇠", sentence: "My ___.", emoji: "🔑" },
        { word: "Phone", meaning: "전화기", sentence: "Use a ___.", emoji: "📱" }
      ],
      19: [
        { word: "Spring", meaning: "봄", sentence: "In ___.", emoji: "🌸" },
        { word: "Summer", meaning: "여름", sentence: "In ___.", emoji: "⛱️" },
        { word: "Fall", meaning: "가을", sentence: "In ___.", emoji: "🍂" },
        { word: "Winter", meaning: "겨울", sentence: "In ___.", emoji: "☃️" },
        { word: "Weather", meaning: "날씨", sentence: "Good ___.", emoji: "🌈" },
        { word: "Wind", meaning: "바람", sentence: "Strong ___.", emoji: "💨" },
        { word: "Snow", meaning: "눈", sentence: "White ___.", emoji: "❄️" },
        { word: "Cloud", meaning: "구름", sentence: "Big ___.", emoji: "☁️" },
        { word: "Warm", meaning: "따뜻한", sentence: "It is ___.", emoji: "🔥" },
        { word: "Cool", meaning: "시원한", sentence: "It is ___.", emoji: "🌬️" }
      ],
      20: [
        { word: "Fast", meaning: "빠른", sentence: "Run ___.", emoji: "⚡" },
        { word: "Slow", meaning: "느린", sentence: "Walk ___.", emoji: "🐢" },
        { word: "Long", meaning: "긴", sentence: "___ hair.", emoji: "📏" },
        { word: "Short", meaning: "짧은", sentence: "___ legs.", emoji: "📐" },
        { word: "Thick", meaning: "두꺼운", sentence: "___ book.", emoji: "📕" },
        { word: "Thin", meaning: "얇은", sentence: "___ paper.", emoji: "📄" },
        { word: "Light", meaning: "가벼운", sentence: "___ box.", emoji: "🎈" },
        { word: "Heavy", meaning: "무거운", sentence: "___ rock.", emoji: "🏋️" },
        { word: "Easy", meaning: "쉬운", sentence: "___ test.", emoji: "✅" },
        { word: "Hard", meaning: "어려운", sentence: "___ work.", emoji: "❌" }
      ],
      21: [
        { word: "See", meaning: "보다", sentence: "I ___ you.", emoji: "👁️" },
        { word: "Look", meaning: "보다", sentence: "___ at me.", emoji: "👀" },
        { word: "Hear", meaning: "듣다", sentence: "I ___ it.", emoji: "👂" },
        { word: "Listen", meaning: "경청하다", sentence: "___ to music.", emoji: "🎧" },
        { word: "Feel", meaning: "느끼다", sentence: "I ___ good.", emoji: "🤲" },
        { word: "Smell", meaning: "냄새맡다", sentence: "___ this.", emoji: "👃" },
        { word: "Taste", meaning: "맛보다", sentence: "___ it.", emoji: "👅" },
        { word: "Touch", meaning: "만지다", sentence: "___ the screen.", emoji: "👆" },
        { word: "Think", meaning: "생각하다", sentence: "I ___ so.", emoji: "💡" },
        { word: "Know", meaning: "알다", sentence: "I ___ you.", emoji: "🧠" }
      ],
      22: [
        { word: "Open", meaning: "열다", sentence: "___ the door.", emoji: "🔓" },
        { word: "Close", meaning: "닫다", sentence: "___ the book.", emoji: "🔒" },
        { word: "Push", meaning: "밀다", sentence: "___ it.", emoji: "🖐️" },
        { word: "Pull", meaning: "당기다", sentence: "___ it.", emoji: "🚜" },
        { word: "Help", meaning: "돕다", sentence: "___ me.", emoji: "🆘" },
        { word: "Show", meaning: "보여주다", sentence: "___ me.", emoji: "👁️‍🗨️" },
        { word: "Tell", meaning: "말하다", sentence: "___ me a story.", emoji: "🗣️" },
        { word: "Ask", meaning: "묻다", sentence: "___ a question.", emoji: "❓" },
        { word: "Answer", meaning: "답하다", sentence: "The ___.", emoji: "❗" },
        { word: "Find", meaning: "찾다", sentence: "___ it.", emoji: "🔍" }
      ],
      23: [
        { word: "Sunday", meaning: "일요일", sentence: "On ___.", emoji: "🗓️" },
        { word: "Monday", meaning: "월요일", sentence: "On ___.", emoji: "📅" },
        { word: "Tuesday", meaning: "화요일", sentence: "On ___.", emoji: "🔥" },
        { word: "Wednesday", meaning: "수요일", sentence: "On ___.", emoji: "💧" },
        { word: "Thursday", meaning: "목요일", sentence: "On ___.", emoji: "🌲" },
        { word: "Friday", meaning: "금요일", sentence: "On ___.", emoji: "💰" },
        { word: "Saturday", meaning: "토요일", sentence: "On ___.", emoji: "⛰️" },
        { word: "Week", meaning: "주", sentence: "One ___.", emoji: "📆" },
        { word: "Month", meaning: "달", sentence: "This ___.", emoji: "🌓" },
        { word: "Year", meaning: "년, 해", sentence: "Every ___.", emoji: "🎡" }
      ],
      24: [
        { word: "Window", meaning: "창문", sentence: "Open ___.", emoji: "🪟" },
        { word: "Table", meaning: "탁자", sentence: "On the ___.", emoji: "🪑" },
        { word: "Lamp", meaning: "전등", sentence: "Desk ___.", emoji: "🕯️" },
        { word: "Computer", meaning: "컴퓨터", sentence: "Use a ___.", emoji: "💻" },
        { word: "Radio", meaning: "라디오", sentence: "Old ___.", emoji: "📻" },
        { word: "Movie", meaning: "영화", sentence: "Watch a ___.", emoji: "🎬" },
        { word: "Music", meaning: "음악", sentence: "Listen to ___.", emoji: "🎵" },
        { word: "Story", meaning: "이야기", sentence: "Funny ___.", emoji: "📖" },
        { word: "Paper", meaning: "종이", sentence: "White ___.", emoji: "📄" },
        { word: "Letter", meaning: "편지", sentence: "Write a ___.", emoji: "✉️" }
      ],
      25: [
        { word: "City", meaning: "도시", sentence: "Big ___.", emoji: "🏙️" },
        { word: "Town", meaning: "마을", sentence: "Small ___.", emoji: "🏘️" },
        { word: "Village", meaning: "마을", sentence: "Quiet ___.", emoji: "🏡" },
        { word: "Country", meaning: "나라", sentence: "My ___.", emoji: "🚩" },
        { word: "World", meaning: "세계", sentence: "Wide ___.", emoji: "🌍" },
        { word: "Earth", meaning: "지구", sentence: "On ___.", emoji: "🌎" },
        { word: "Fire", meaning: "불", sentence: "Hot ___.", emoji: "🔥" },
        { word: "Water", meaning: "물", sentence: "Cold ___.", emoji: "🚿" },
        { word: "Air", meaning: "공기", sentence: "Clean ___.", emoji: "🌬️" },
        { word: "Stone", meaning: "돌", sentence: "Hard ___.", emoji: "🪨" }
      ],
      26: [
        { word: "Circle", meaning: "원", sentence: "Round ___.", emoji: "⭕" },
        { word: "Square", meaning: "정사각형", sentence: "A box ___.", emoji: "⬛" },
        { word: "Triangle", meaning: "삼각형", sentence: "Side ___.", emoji: "🔺" },
        { word: "Point", meaning: "점", sentence: "Red ___.", emoji: "📍" },
        { word: "Line", meaning: "선", sentence: "Long ___.", emoji: "➖" },
        { word: "Side", meaning: "옆", sentence: "By my ___.", emoji: "⬅️" },
        { word: "Middle", meaning: "가운데", sentence: "In the ___.", emoji: "🎯" },
        { word: "Front", meaning: "앞", sentence: "In ___.", emoji: "⬆️" },
        { word: "Back", meaning: "뒤", sentence: "At the ___.", emoji: "⬇️" },
        { word: "Top", meaning: "꼭대기", sentence: "On ___.", emoji: "🔝" }
      ],
      27: [
        { word: "Many", meaning: "많은", sentence: "___ books.", emoji: "👨‍👩‍👧‍👦" },
        { word: "Much", meaning: "많은", sentence: "___ water.", emoji: "🌊" },
        { word: "Some", meaning: "약간의", sentence: "___ juice.", emoji: "🤏" },
        { word: "Any", meaning: "어떤", sentence: "___ fruit?", emoji: "❓" },
        { word: "All", meaning: "모든", sentence: "___ together.", emoji: "💯" },
        { word: "Every", meaning: "모든", sentence: "___ day.", emoji: "🔄" },
        { word: "Each", meaning: "각각의", sentence: "___ boy.", emoji: "👤" },
        { word: "Other", meaning: "다른", sentence: "The ___ one.", emoji: "👥" },
        { word: "Another", meaning: "또 하나", sentence: "___ one.", emoji: "➕" },
        { word: "Same", meaning: "같은", sentence: "The ___.", emoji: "👯" }
      ],
      28: [
        { word: "Now", meaning: "지금", sentence: "Do it ___.", emoji: "⏳" },
        { word: "Then", meaning: "그때", sentence: "And ___.", emoji: "🕰️" },
        { word: "Always", meaning: "항상", sentence: "___ happy.", emoji: "♾️" },
        { word: "Often", meaning: "자주", sentence: "___ go.", emoji: "🔄" },
        { word: "Never", meaning: "절대~않다", sentence: "___ lie.", emoji: "🚫" },
        { word: "Before", meaning: "전에", sentence: "___ lunch.", emoji: "⏪" },
        { word: "After", meaning: "후에", sentence: "___ school.", emoji: "⏩" },
        { word: "Again", meaning: "다시", sentence: "Try ___.", emoji: "🔁" },
        { word: "Very", meaning: "매우", sentence: "___ good.", emoji: "‼️" },
        { word: "Only", meaning: "오직", sentence: "___ you.", emoji: "1️⃣" }
      ],
      29: [
        { word: "With", meaning: "~와 함께", sentence: "___ me.", emoji: "🤝" },
        { word: "For", meaning: "~을 위해", sentence: "___ you.", emoji: "🎁" },
        { word: "From", meaning: "~로부터", sentence: "___ school.", emoji: "📤" },
        { word: "To", meaning: "~에게, ~로", sentence: "Go ___ home.", emoji: "📥" },
        { word: "In", meaning: "~안에", sentence: "___ the box.", emoji: "🧤" },
        { word: "On", meaning: "~위에", sentence: "___ the table.", emoji: "🏠" },
        { word: "At", meaning: "~에서", sentence: "___ home.", emoji: "📌" },
        { word: "Under", meaning: "~아래에", sentence: "___ the bed.", emoji: "👇" },
        { word: "By", meaning: "~옆에, ~에 의해", sentence: "Stand ___ me.", emoji: "🚶‍♂️" },
        { word: "Of", meaning: "~의", sentence: "King ___ it.", emoji: "🔗" }
      ],
      30: [
        { word: "Hello", meaning: "안녕", sentence: "___!", emoji: "📢" },
        { word: "Goodbye", meaning: "잘 가", sentence: "Say ___.", emoji: "🏃‍♂️💨" },
        { word: "Please", meaning: "제발", sentence: "___ help.", emoji: "🙏" },
        { word: "Thanks", meaning: "고마워", sentence: "Many ___.", emoji: "✨" },
        { word: "Sorry", meaning: "미안해", sentence: "I am ___.", emoji: "🙇" },
        { word: "Welcome", meaning: "환영해", sentence: "You are ___.", emoji: "🤗" },
        { word: "Yes", meaning: "네", sentence: "___, please.", emoji: "✅" },
        { word: "No", meaning: "아니오", sentence: "___, thanks.", emoji: "❌" },
        { word: "Ok", meaning: "좋아", sentence: "It is ___.", emoji: "👌" },
        { word: "Love", meaning: "사랑하다", sentence: "I ___ you.", emoji: "❤️" }
      ]
   };

const Level1 = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('home');
    const [selectedDay, setSelectedDay] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null); 
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [voices, setVoices] = useState([]);
    const [currentSessionMistakes, setCurrentSessionMistakes] = useState([]);
    const [randomIdx, setRandomIdx] = useState(0);
    const [showEmojiInQuiz, setShowEmojiInQuiz] = useState(true);

    const themeColor = "#E29526"; // Fendi Yellow
    const mistakeColor = "#70011D";

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('araon_voca_level_1');
        return saved ? JSON.parse(saved) : {};
    });

    const feedbackMessages = {
        high: [{ title: "EXCELLENT!", text: "기초가 탄탄하군요! 정말 대단해요." }, { title: "PERFECT!", text: "만점입니다! 정말 멋져요!" }],
        mid: [{ title: "GOOD JOB!", text: "잘하고 있어요! 오답 노트를 확인해 보세요." }, { title: "KEEP IT UP", text: "조금만 더 집중하면 만점도 가능합니다!" }],
        low: [{ title: "NICE TRY", text: "포기하지 마세요! 반복 학습이 가장 중요합니다." }, { title: "DO IT AGAIN", text: "한 번 더 도전해서 점수를 높여보세요!" }]
    };

    // ✨ 전역 배경색 및 시스템 테마 동기화 로직 ✨
    useEffect(() => {
        const root = window.document.documentElement;
        const body = window.document.body;
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            body.style.backgroundColor = '#0A0A0B'; // 컴퓨터 뷰 다크 배경 설정
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            body.style.backgroundColor = '#F8F9FA'; // 컴퓨터 뷰 라이트 배경 설정
        }
        
        // 상단바 영역을 레벨 테마색으로 강제 고정
        if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
    }, [isDarkMode, themeColor]);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
            setVoices(available); // setVoices 사용으로 eslint 경고 해결
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        localStorage.setItem('araon_voca_level_1', JSON.stringify(history));
    }, [history]);

    const speak = (text) => {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        const voiceIdx = parseInt(localStorage.getItem('araon_voca_voice_idx') || '0');
        if (voices[voiceIdx]) msg.voice = voices[voiceIdx];
        msg.lang = 'en-US'; msg.rate = 0.85;
        window.speechSynthesis.speak(msg);
    };

    const handleBackClick = () => {
        if (view === 'home') navigate('/');
        else if (['list', 'quiz', 'mistakes'].includes(view)) setView('menu');
        else if (view === 'menu' || view === 'result') setView('home');
    };

    const startQuiz = () => {
        const currentData = DATA_BY_DAY[Number(selectedDay)] || [];
        const shuffled = [...currentData].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentIndex(0); setScore(0); setCurrentSessionMistakes([]);
        setShowFeedback(false); setSelectedAnswer(null); setView('quiz');
    };

    const handleAnswer = (answer) => {
        if (showFeedback) return;
        setSelectedAnswer(answer); setShowFeedback(true);
        const correctWord = questions[currentIndex].word;
        const isCorrect = answer.word === correctWord;

        if (isCorrect) {
            setScore(s => s + 1);
            speak(correctWord);
        } else {
            const updatedMistakes = [...currentSessionMistakes, correctWord];
            setCurrentSessionMistakes(updatedMistakes);
            setHistory(prev => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    attempts: [updatedMistakes, ...(prev[selectedDay]?.attempts?.slice(1) || [])].slice(0, 5)
                }
            }));
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1); setShowFeedback(false); setSelectedAnswer(null);
            } else {
                setRandomIdx(Math.floor(Math.random() * 2));
                const finalScore = isCorrect ? score + 1 : score;
                setHistory(prev => ({
                    ...prev, 
                    [selectedDay]: { 
                        ...prev[selectedDay],
                        completed: true, 
                        bestScore: Math.max((prev[selectedDay]?.bestScore || 0), finalScore), 
                        total: questions.length
                    }
                }));
                setView('result');
            }
        }, 1200);
    };

    const currentOptions = useMemo(() => {
        if (view !== 'quiz' || !questions[currentIndex]) return [];
        const correct = questions[currentIndex];
        const currentData = DATA_BY_DAY[Number(selectedDay)] || [];
        const others = currentData.filter(v => v.word !== correct.word).sort(() => Math.random() - 0.5).slice(0, 3);
        return [correct, ...others].sort(() => Math.random() - 0.5);
    }, [questions, currentIndex, selectedDay, view]);

    const mistakeList = useMemo(() => {
        if (!selectedDay || !history[selectedDay]?.attempts) return [];
        const allMissed = history[selectedDay].attempts.flat();
        const counts = allMissed.reduce((acc, word) => { acc[word] = (acc[word] || 0) + 1; return acc; }, {});
        const currentData = DATA_BY_DAY[Number(selectedDay)] || [];
        return Object.entries(counts).map(([word, count]) => ({
            word, count, data: currentData.find(d => d.word === word)
        }))
        .filter(item => item.data)
        .sort((a, b) => b.count - a.count);
    }, [history, selectedDay]);

    return (
        /* 배경색: 라이트(#F8F9FA), 다크(#0A0A0B) 동기화 */
        <div className="min-h-screen flex flex-col max-w-md mx-auto transition-all duration-300 font-sans">
            
            {/* ✨ 헤더: 시스템 노치 영역(safe-area) 여백 확보 및 컬러 적용 ✨ */}
            <header className="sticky top-0 z-20 flex flex-col transition-colors border-b border-black/10 shadow-sm" 
                    style={{ 
                        backgroundColor: themeColor, 
                        paddingTop: 'env(safe-area-inset-top)', 
                        minHeight: 'calc(70px + env(safe-area-inset-top))' 
                    }}>
                <div className="flex-1 flex items-center px-4 justify-between w-full h-16">
                    <button onClick={handleBackClick} className="p-2 text-white active:opacity-70 rounded-full">
                        <i className="ph-bold ph-caret-left text-2xl"></i>
                    </button>
                    <div className="flex flex-col items-center">
                        <img 
                          src="/Araon_logo_b.png" 
                          alt="ARAON SCHOOL" 
                          className="h-7 w-auto object-contain select-none invert brightness-200"
                        />
                    </div>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-white active:opacity-70 rounded-full">
                        <i className={`ph-bold ${isDarkMode ? 'ph-sun' : 'ph-moon'} text-2xl`}></i>
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                {view === 'home' && (
                    <div className="animate__animated animate__fadeIn">
                        <div className="p-8 rounded-[2.2rem] text-white shadow-xl mb-8 border border-white/5" 
                             style={{ backgroundColor: themeColor }}>
                            <div className="flex justify-between items-center mb-3 px-1">
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Essential Mastery</p>
                                <div className="flex items-center space-x-2 font-black">
                                    <span className="text-xs opacity-90">{Object.values(history).filter(h => h.completed).length} / 30 완료</span>
                                    <span className="text-xl tracking-tighter">{Math.round((Object.values(history).filter(h => h.completed).length / 30) * 100)}%</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(Object.values(history).filter(h => h.completed).length / 30) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 pb-10">
                            {Object.keys(DAY_TITLES).sort((a,b)=>Number(a)-Number(b)).map(d => (
                                <button key={d} onClick={() => { setSelectedDay(d); setView('menu'); }} 
                                        className={`p-6 rounded-[2.2rem] border-2 flex items-center justify-between transition-all active:scale-[0.97] ${history[d]?.completed ? 'bg-white border-slate-200 dark:bg-[#1E1E1E] dark:border-slate-800 shadow-inner' : 'bg-white border-slate-100 dark:bg-[#1E1E1E] dark:border-slate-800 shadow-sm'}`}>
                                    <div className="flex items-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 text-white`} 
                                             style={{ backgroundColor: history[d]?.completed ? themeColor : '#cbd5e1' }}>
                                            <span className="font-black text-xs">D{d}</span>
                                        </div>
                                        <div className="text-left font-bold dark:text-slate-100">{DAY_TITLES[d]}</div>
                                    </div>
                                    <i className="ph-bold ph-caret-right text-slate-300"></i>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'menu' && (
                    <div className="animate__animated animate__fadeInUp flex flex-col pt-10">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 text-white rounded-[2.2rem] flex items-center justify-center mx-auto mb-6 shadow-lg font-black text-2xl" style={{ backgroundColor: themeColor }}>D{selectedDay}</div>
                            <h2 className="text-2xl font-black dark:text-white uppercase px-4 break-keep">{DAY_TITLES[selectedDay]}</h2>
                        </div>

                        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 mb-6 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center">
                                    <i className="ph-fill ph-sparkle text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-black dark:text-white uppercase tracking-tighter">Emoji Hints</p>
                                    <p className="text-[10px] text-zinc-400 font-bold tracking-tighter">퀴즈 중 이모지 표시</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEmojiInQuiz(!showEmojiInQuiz)} className={`w-14 h-8 rounded-full transition-all relative ${showEmojiInQuiz ? 'bg-amber-400' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${showEmojiInQuiz ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button onClick={() => setView('list')} className="w-full p-6 bg-white dark:bg-[#1E1E1E] border-2 rounded-[2.2rem] flex items-center shadow-sm active:scale-95 transition-all" style={{ borderColor: themeColor }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}><i className="ph-fill ph-book-open text-2xl"></i></div>
                                <div className="text-left"><h3 className="font-bold dark:text-slate-100">단어 학습</h3><p className="text-slate-400 text-xs font-bold">Vocabulary</p></div>
                            </button>
                            <button onClick={startQuiz} className="w-full p-6 text-white rounded-[2.2rem] flex items-center shadow-lg active:scale-95 transition-all" style={{ backgroundColor: themeColor }}>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"><i className="ph-fill ph-lightning text-2xl"></i></div>
                                <div className="text-left"><h3 className="font-bold">퀴즈 시작</h3><p className="text-white/60 text-xs font-bold">Start Quiz</p></div>
                            </button>
                            <button onClick={() => setView('mistakes')} className="w-full p-6 bg-white dark:bg-[#1E1E1E] border-2 rounded-[2.2rem] flex items-center shadow-sm active:scale-95 transition-all" style={{ borderColor: mistakeColor }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: `${mistakeColor}20`, color: mistakeColor }}><i className="ph-fill ph-warning-circle text-2xl"></i></div>
                                <div className="text-left"><h3 className="font-bold" style={{ color: mistakeColor }}>오답노트</h3><p className="text-slate-400 text-xs font-bold">Review</p></div>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="animate__animated animate__fadeIn">
                        <div className="flex justify-between items-center mb-10 text-[10px] font-black uppercase tracking-widest" style={{ color: themeColor }}>
                            <span>{currentIndex + 1} / {questions.length}</span>
                            <div className="flex-1 mx-4 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: themeColor }}></div>
                            </div>
                        </div>
                        <div className="text-center mb-16 pt-10 px-4">
                            {showEmojiInQuiz && <span className="text-6xl mb-6 block animate__animated animate__bounceIn">{questions[currentIndex].emoji}</span>}
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter break-keep leading-tight">{questions[currentIndex].word}</h3>
                            <button onClick={() => speak(questions[currentIndex].word)} className="mt-8 text-slate-300 hover:text-slate-500 transition-colors"><i className="ph-bold ph-speaker-high text-3xl"></i></button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {currentOptions.map((opt, i) => {
                                const isCorrectOption = opt.word === questions[currentIndex].word;
                                const isSelected = selectedAnswer === opt;
                                const isSelectedIncorrect = isSelected && !isCorrectOption;
                                return (
                                    <button key={i} disabled={showFeedback} onClick={() => handleAnswer(opt)}
                                        className={`p-6 rounded-[2.2rem] font-bold text-lg border-2 transition-all ${!showFeedback ? 'bg-white dark:bg-[#1E1E1E] border-slate-100 dark:border-slate-800 dark:text-slate-300 shadow-sm active:scale-95' : isCorrectOption ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg scale-105' : (isSelected ? 'text-white' : 'opacity-20 bg-slate-100 dark:bg-slate-800')}`}
                                        style={{ borderColor: (showFeedback && isSelectedIncorrect) ? mistakeColor : undefined, backgroundColor: (showFeedback && isSelectedIncorrect) ? mistakeColor : undefined }}>
                                        {opt.meaning}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {view === 'list' && (
                    <div className="animate__animated animate__fadeIn pb-10">
                        <div className="mb-6 text-center"><h3 className="text-lg font-black dark:text-white">{DAY_TITLES[selectedDay]}</h3></div>
                        <div className="space-y-3">
                            {DATA_BY_DAY[Number(selectedDay)]?.map((item, idx) => (
                                <div key={idx} className="p-5 bg-white dark:bg-[#1E1E1E] border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                                    <div className="flex-1 pr-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <div className="text-xl font-bold dark:text-white">{item.word}</div>
                                        </div>
                                        <div className="text-slate-500 text-sm mt-1 ml-9">{item.meaning}</div>
                                    </div>
                                    <button onClick={() => speak(item.word)} className="w-12 h-12 rounded-xl flex items-center justify-center active:scale-90 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}><i className="ph-bold ph-speaker-high text-xl"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'mistakes' && (
                    <div className="animate__animated animate__fadeIn pb-10">
                        <div className="text-center mb-8 px-1"><span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: mistakeColor }}>Cumulative Analysis</span><h3 className="text-xl font-black mt-1 dark:text-white">내 오답 리스트</h3></div>
                        <div className="space-y-3">
                            {mistakeList.map((item, idx) => (
                                <div key={idx} className="p-5 bg-white dark:bg-[#1E1E1E] border-2 rounded-2xl flex items-center justify-between shadow-sm" style={{ borderColor: `${mistakeColor}20` }}>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black mr-4" style={{ backgroundColor: `${mistakeColor}20`, color: mistakeColor }}>{item.count}회</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span>{item.data?.emoji}</span>
                                                <div className="text-lg font-bold dark:text-white">{item.word}</div>
                                            </div>
                                            <div className="text-sm text-slate-500 ml-7">{item.data?.meaning}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => speak(item.word)} className="w-12 h-12 rounded-xl flex items-center justify-center active:scale-90 transition-transform" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}><i className="ph-bold ph-speaker-high text-xl"></i></button>
                                </div>
                            ))}
                            {mistakeList.length === 0 && <div className="py-20 text-center opacity-20"><i className="ph-fill ph-shield-check text-6xl mb-4"></i><p className="font-bold">기록이 없습니다.</p></div>}
                        </div>
                    </div>
                )}
                
                {view === 'result' && (
                    <div className="animate__animated animate__fadeIn text-center py-10 px-4">
                        <div className="w-28 h-28 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border-b-4 border-black/20" style={{ backgroundColor: themeColor }}><i className="ph-fill ph-crown text-6xl"></i></div>
                        <h2 className="text-3xl font-black mb-10 italic uppercase dark:text-white break-keep leading-tight">{feedbackMessages[score >= (questions.length * 0.8) ? 'high' : score >= (questions.length * 0.5) ? 'mid' : 'low'][randomIdx].title}</h2>
                        <div className="w-full p-10 rounded-[3rem] text-white mb-10 border-t-4 border-white/20 shadow-2xl" style={{ backgroundColor: themeColor }}>
                            <p className="text-white/60 text-[10px] font-black uppercase mb-3 tracking-[0.3em]">Final Score</p>
                            <div className="text-7xl font-black tracking-tighter text-white">{score} <span className="text-2xl text-white/40 font-normal">/ {questions.length}</span></div>
                        </div>
                        <button onClick={() => setView('home')} className="w-full p-6 text-white rounded-[1.8rem] font-black text-xl shadow-lg active:scale-95 transition-transform" style={{ backgroundColor: themeColor }}><i className="ph-bold ph-house-line mr-3 text-2xl"></i> 홈으로 돌아가기</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Level1;