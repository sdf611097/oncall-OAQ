# Oncall-OAQ
==
## Build the environment by docker

* build docker image
    ```
    docker build -t oncall .
    ```
* Run your container
    ```
    docker run -it --rm -p 3000:3000 --name oncall-qq oncall 
    ```
