FROM node:6

ENV HOME=/home/app

COPY package.json $HOME/pomodorify-backend/

WORKDIR $HOME/pomodorify-backend
RUN npm cache clean && npm install --progress=false

COPY . $HOME/pomodorify-backend

CMD ["npm", "start"]
