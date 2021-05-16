# CMSC828D-FinalProject
This is the online repository that contains the necessary filese for the final projct for CMSC828D 

## Setup

To run this you need three dependencies: 
- Docker
- Docker Compose
- Docker Machine

Once Installed go to the project root and run the following commands: docker-machine create default

```bash
docker-machine start 
eval $(docker-machine env default) 
docker-compose up --build -d  
python3 src/parse_xml.py "Mitzpeh" <<path to mitzpeh Issue_metadata.csv>> && python3 src/parse_xml.py "Black Explosion" <<path to black explosion Issue_metadata.csv>>
```

replicate the above steps adjusted to your preferred shell and the location of your data.

