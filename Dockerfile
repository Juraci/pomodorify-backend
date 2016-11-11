FROM node:6.9.1

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json $HOME/pomodorify-backend/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/pomodorify-backend
RUN npm cache clean && npm install --silent --progress=false

USER root
COPY . $HOME/pomodorify-backend
RUN chown -R app:app $HOME/*
USER app

CMD ["npm", "start"]
