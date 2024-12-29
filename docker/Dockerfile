FROM denoland/deno:1.46.1

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN rm -fr node_modules _fresh 

RUN deno task build

RUN deno cache --reload main.ts

CMD ["run", "-A", "--unstable-ffi", "main.ts"]