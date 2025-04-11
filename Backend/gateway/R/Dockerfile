FROM r-base:4.3.1

# Install system dependencies required for rgl and others
RUN apt-get update && apt-get install -y \
    pandoc \
    libx11-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libpng-dev \
    libssl-dev \
    libcurl4-openssl-dev \
    libxml2-dev \
    xauth \
    x11-xserver-utils \
    && apt-get clean

# Install R packages
RUN R -e "install.packages(c('ggplot2', 'plotly', 'rgl'), repos='https://cloud.r-project.org')"

WORKDIR /app
