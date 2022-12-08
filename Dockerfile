FROM arm32v7/node:14
ENV LEVEL=1

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN node -v
RUN npm -v
RUN npm install --only=prod
RUN npm install npm install sqlite3 --build-from-source  --sqlite=/usr/local --verbose

# Make port 3000 available to the world outside this container
EXPOSE 3000


# Run app.py when the container launches
CMD node main.js --level $LEVEL
