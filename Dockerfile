# nginx 이미지를 기반으로 생성
FROM nginx

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 현재 디렉토리의 build 폴더를 /app/build로 복사
ADD ./build ./build

# 기본 nginx 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 로컬의 nginx.conf 파일을 nginx 설정 경로로 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80 포트 오픈
EXPOSE 80

# 컨테이너 실행 시 nginx를 포그라운드 모드로 실행
CMD ["nginx", "-g", "daemon off;"]
