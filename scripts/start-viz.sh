if [ ${PWD##*/} == "scripts" ]; then
  cd ..
fi
cd viz
python -m SimpleHTTPServer
