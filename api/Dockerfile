FROM python:3.6.1-alpine
WORKDIR /d-project
ADD . /d-project
RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install -r requirements.txt
CMD ["python","app.py"]