# Starts `serverless offline` in background and
# waints for the server to be ready

TMPFILE=/tmp/offline$$.log
if [ -f .offline.pid ]; then
    echo "Found file .offline.pid. Not starting."
    exit 1
fi

#serverless offline 2>&1 > $TMPFILE &
serverless offline >>$TMPFILE 2>&1 &
PID=$!
echo $PID > .offline.pid

while ! grep "Server ready" $TMPFILE
do sleep 1; done

rm $TMPFILE
