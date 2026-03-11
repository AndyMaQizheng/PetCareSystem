# Docker 服务器安装、使用与理解笔记

更新时间：2026-03-11 (UTC)
环境：Ubuntu 24.04.3 LTS（Noble）

## 1. 本次已完成的事情

我已经在这台服务器上完成了 Docker 安装与验证：

- 安装了 Docker 官方仓库版本，而不是 Ubuntu 自带的旧包
- 安装了以下组件：
  - `docker-ce`
  - `docker-ce-cli`
  - `containerd.io`
  - `docker-buildx-plugin`
  - `docker-compose-plugin`
- 启动并设置了 Docker 开机自启
- 将 `ubuntu` 用户加入了 `docker` 用户组
- 验证了：
  - Docker daemon 正常运行
  - `docker compose` 可用
  - `hello-world` 镜像可正常拉取并运行
  - 非 sudo 场景下可通过 docker 组使用 Docker

## 2. 当前实际状态

### 2.1 版本

- Docker Engine: `29.3.0`
- Docker Compose plugin: `v5.1.0`

### 2.2 服务状态

- `docker.service`: `active`
- 开机自启：`enabled`

### 2.3 用户权限

当前用户 `ubuntu` 已在 `docker` 组中：

```bash
getent group docker
id ubuntu
```

如果你在一个旧终端里还遇到：

```bash
permission denied while trying to connect to the Docker daemon socket
```

通常不是 Docker 没装好，而是**当前 shell 还没刷新 group membership**。

处理方式任选其一：

```bash
newgrp docker
```

或者直接重新登录 SSH / 新开一个 shell。

---

## 3. 我实际执行的安装路径

采用的是 **Docker 官方 APT 仓库** 的标准方式。

### 3.1 安装前置依赖

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
```

### 3.2 添加 Docker 官方 GPG key

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### 3.3 添加 Docker 官方仓库

```bash
ARCH=$(dpkg --print-architecture)
CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")

echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 3.4 安装 Docker Engine + Compose

```bash
sudo apt-get update
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

### 3.5 启动并设置开机自启

```bash
sudo systemctl enable --now docker
```

### 3.6 将当前用户加入 docker 组

```bash
sudo usermod -aG docker ubuntu
```

### 3.7 基础验证

```bash
docker --version
sudo docker compose version
systemctl is-active docker
sudo docker run --rm hello-world
```

---

## 4. 为什么这样装，而不是 `apt install docker.io`

Ubuntu 仓库里的 `docker.io` 通常不是最新的 Docker 官方版本。

用官方仓库的好处：

- 版本更新更及时
- Compose plugin / Buildx plugin 跟得更紧
- 文档与实际行为更一致
- 后续升级路径更清晰

简单说：

- **生产/长期维护**：更推荐官方仓库
- **临时试验机**：`docker.io` 也能用，但不如官方仓库稳定统一

---

## 5. 怎么理解 Docker：一张脑图

很多人会把 Docker 理解成“轻量虚拟机”，这不算全错，但更准确的说法是：

**Docker = 容器运行时 + 镜像分发机制 + 一套应用打包/运行标准。**

### 5.1 核心概念

#### Image（镜像）

镜像是应用运行的只读模板。

比如：
- `nginx:latest`
- `postgres:16`
- `node:22`

你可以理解成：
- 应用代码
- 依赖
- 运行环境
- 启动命令

都被打包成一个可复用模板。

#### Container（容器）

容器是镜像启动后的运行实例。

关系可以理解为：

- 镜像 = 类 / 模板
- 容器 = 实例

你可以从同一个镜像启动很多容器。

#### Docker Engine / daemon

Docker 后台服务，也就是 `dockerd`，负责：

- 拉镜像
- 创建容器
- 管理网络
- 管理 volume
- 处理日志

你在命令行里输入 `docker ...`，本质上是客户端在跟 daemon 通信。

#### Volume（卷）

Volume 用于数据持久化。

因为容器本身适合“可销毁”，但数据库数据、上传文件、配置文件不能随容器销毁。

所以通常：
- 容器负责运行
- volume 负责存数据

#### Network（网络）

Docker 会给容器分配独立网络环境。

常见用法：
- 把容器端口映射到宿主机：`-p 80:80`
- 多个容器挂到同一网络里互相访问

---

## 6. 最常用的 Docker 命令

### 6.1 看版本

```bash
docker --version
docker compose version
```

### 6.2 看运行中的容器

```bash
docker ps
```

### 6.3 看所有容器（包含已退出）

```bash
docker ps -a
```

### 6.4 拉镜像

```bash
docker pull nginx:latest
```

### 6.5 启动一个临时容器

```bash
docker run --rm hello-world
```

### 6.6 启动一个 nginx

```bash
docker run -d --name my-nginx -p 8080:80 nginx:latest
```

说明：
- `-d`：后台运行
- `--name`：容器名
- `-p 8080:80`：宿主机 8080 映射到容器 80

### 6.7 看日志

```bash
docker logs my-nginx
docker logs -f my-nginx
```

### 6.8 进入容器

```bash
docker exec -it my-nginx sh
```

如果容器里有 bash，也可以：

```bash
docker exec -it my-nginx bash
```

### 6.9 停止/删除容器

```bash
docker stop my-nginx
docker rm my-nginx
```

### 6.10 删除镜像

```bash
docker rmi nginx:latest
```

---

## 7. Docker Compose 是什么

如果你只跑一个容器，`docker run` 够用。

但真实服务往往是多组件组合：
- Web 服务
- 数据库
- Redis
- 反向代理
- Worker

这时候用 `docker compose` 更合适。

### 7.1 一个最小 compose 示例

创建 `compose.yaml`：

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

启动：

```bash
docker compose up -d
```

查看：

```bash
docker compose ps
docker compose logs -f
```

停止并删除：

```bash
docker compose down
```

### 7.2 如果有数据卷

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
```

这里 `pgdata` 就是持久化卷。

---

## 8. 服务器上使用 Docker 的建议姿势

### 8.1 不要把所有东西都直接跑在宿主机

尽量让服务以容器形式运行，优点：
- 环境一致
- 易迁移
- 易回滚
- 更容易做多服务编排

### 8.2 配置文件和数据要分开

推荐：
- 代码 / 镜像：容器内
- 数据：volume 或宿主机挂载目录
- 配置：`.env` / compose 文件 / secret 管理

### 8.3 总是设置重启策略

例如：

```yaml
restart: unless-stopped
```

这样机器重启后服务更容易自动恢复。

### 8.4 日志别无限膨胀

如果长期跑服务，建议配置日志轮转。

例如 compose：

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

### 8.5 数据库一定要做备份

Docker 不是备份。

你把 MySQL/Postgres 跑进容器，不代表数据安全。关键还是：
- volume 在哪
- 怎么备份
- 怎么恢复

---

## 9. 本机上最值得先记住的验证命令

### 查看 Docker 是否活着

```bash
systemctl status docker --no-pager
```

### 查看版本

```bash
docker --version
docker compose version
```

### 测试 daemon 是否正常

```bash
docker run --rm hello-world
```

### 看容器

```bash
docker ps -a
```

### 看镜像

```bash
docker images
```

### 看磁盘占用

```bash
docker system df
```

---

## 10. 常见问题排查

### 10.1 `docker: command not found`

说明命令没装好，或者 PATH 有问题。

排查：

```bash
command -v docker
dpkg -l | grep -E 'docker|containerd'
```

### 10.2 `Cannot connect to the Docker daemon`

通常是 daemon 没启动。

排查：

```bash
systemctl status docker --no-pager
sudo systemctl restart docker
```

### 10.3 `permission denied while trying to connect to the Docker daemon socket`

通常是用户不在 `docker` 组，或者 shell 没刷新。

处理：

```bash
sudo usermod -aG docker $USER
newgrp docker
```

或者重新登录。

### 10.4 拉镜像慢/失败

常见原因：
- 网络差
- Docker Hub 限流
- 出口限制

排查方向：
- 先确认宿主机 `curl` 正常
- 再确认 Docker daemon 出网正常
- 需要时再考虑镜像加速器

### 10.5 容器起不来

先看日志：

```bash
docker logs <container-name>
```

如果是 compose：

```bash
docker compose logs -f
```

---

## 11. 一个推荐的学习顺序

如果你想真正把 Docker 用顺手，我建议按这个顺序：

1. **先理解镜像、容器、端口映射**
2. **学会 `docker ps / logs / exec / rm`**
3. **学会 volume 持久化**
4. **学会 `docker compose up -d`**
5. **再学 Dockerfile**（自己构建镜像）
6. **最后再碰多阶段构建、Buildx、镜像优化、私有仓库**

别一上来就啃一整套云原生概念，容易虚胖。

---

## 12. 这台服务器后续可以怎么用 Docker

你现在已经可以拿它做这些事：

- 跑 Nginx / Caddy
- 跑 Node / Python / Go 服务
- 跑 Postgres / Redis / MySQL
- 跑监控栈（Prometheus / Grafana）
- 跑 CI 辅助服务
- 用 compose 管理一整套应用

如果你下一步要部署具体项目，我建议直接进入这个套路：

1. 写 `compose.yaml`
2. 配 `.env`
3. `docker compose up -d`
4. 看日志
5. 验证端口/域名
6. 再补备份和升级策略

---

## 13. 本次安装的最终结论

这台服务器上的 Docker 环境已经配置完成，并通过了实际验证。

### 已验证通过

- [x] Docker Engine 已安装
- [x] Docker daemon 已启动
- [x] Docker 开机自启已开启
- [x] Compose plugin 可用
- [x] `hello-world` 容器运行成功
- [x] `ubuntu` 用户已具备非 sudo 使用能力（经 docker 组验证）

### 你现在最值得记住的三条命令

```bash
docker ps
docker compose up -d
docker logs -f <container>
```

如果你要，我下一步可以继续帮你补一份：

- **Dockerfile 教程**
- **Compose 实战模板**
- **Node / Python / Nginx / Postgres 的部署模板**
