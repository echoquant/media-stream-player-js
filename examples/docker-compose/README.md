# Run with docker compose

Modify html/index.html and set proper server public IP adress where this
docker-compose will be run.
In example below server IP was 172.16.14.129
wsproxy="172.16.14.129:8012/websockify/?ip=wowzaec2demo.streamlock.net&port=554".

```
docker-compose up -d
```

## Customize port

```
echo WS_RTSP_PORT=<port> > ./.env
docker-compose up -d
```

## WS TCP proxy access

When docker container will start proxy will be available at:

```
http://<server_ip>:<custom_port|8844>/websockify?host=<dsthost>&port=<dstport>
```
