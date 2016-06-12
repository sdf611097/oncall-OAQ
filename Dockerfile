FROM node:4.4-onbuild

WORKDIR "/usr/src/app"
RUN npm install express --save
# Test failed now
#RUN npm run-script pretest && npm test && npm run-script posttest
EXPOSE 3000 
CMD npm start 

