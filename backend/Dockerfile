FROM node:18

# ספריית עבודה כללית
WORKDIR /app

# העתק package.json + package-lock.json
COPY package*.json ./


# התקן את התלויות
RUN npm install

# העתק את כל הקבצים של backend כולל final_project
COPY . .

# עבור לתיקייה שבה נמצא app.js
WORKDIR /app/final_project

# חשיפה של פורט
EXPOSE 3003
# 3001

# הפעלה עם nodemon
# CMD ["npx", "nodemon", "app.js"]
CMD ["node", "app.js"]
