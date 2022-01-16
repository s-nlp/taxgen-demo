FROM python:3.9.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/prepare_nltk.py ./src/prepare_nltk.py
RUN python src/prepare_nltk.py

COPY src/prepare_fasttext.py ./src/prepare_fasttext.py
RUN python src/prepare_fasttext.py

COPY src ./src
ENV PYTHONPATH=src
CMD ["python", "src/main.py"]
