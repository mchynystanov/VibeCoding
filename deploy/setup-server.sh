#!/usr/bin/env bash
# Первоначальная настройка чистого Ubuntu 22.04/24.04 VPS для Paomma Shop.
# Запускать один раз на новом сервере (через SSH, от пользователя с sudo).
#
#   bash setup-server.sh
#
# Ставит: Node.js 20 LTS, nginx, certbot (SSL), sops, age, pm2.
# Ничего не разворачивает и не трогает секреты — это отдельные шаги
# в deploy/README.md.

set -euo pipefail

# Без этого apt может остановиться на вопросе про конфликт конфигурации
# (например sshd_config) и ждать ответа, которого некому дать в
# автоматическом запуске — держим текущие локальные конфиги как есть.
export DEBIAN_FRONTEND=noninteractive
APT_OPTS=(-o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold")

echo "== Обновление пакетов =="
sudo -E apt-get update
sudo -E apt-get "${APT_OPTS[@]}" upgrade -y

echo "== Файл подкачки (swap) =="
# На серверах с 1 ГБ RAM сборка Next.js (npm run build) может не хватить
# памяти и упасть. Добавляем 2 ГБ swap — дешёвая страховка, почти не влияет
# на обычную работу сайта, но не даёт сборке падать при пиковой нагрузке.
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
  echo "Swap-файл уже существует, пропускаю."
fi

echo "== Node.js 20 LTS =="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo -E apt-get install -y nodejs

echo "== git, nginx, certbot =="
sudo -E apt-get "${APT_OPTS[@]}" install -y git nginx certbot python3-certbot-nginx

echo "== age (шифрование, на котором работает sops) =="
AGE_VERSION="v1.2.1"
curl -fsSL "https://github.com/FiloSottile/age/releases/download/${AGE_VERSION}/age-${AGE_VERSION}-linux-amd64.tar.gz" \
  -o /tmp/age.tar.gz
tar -xzf /tmp/age.tar.gz -C /tmp
sudo mv /tmp/age/age /tmp/age/age-keygen /usr/local/bin/
rm -rf /tmp/age.tar.gz /tmp/age

echo "== sops =="
SOPS_VERSION="v3.9.1"
curl -fsSL "https://github.com/getsops/sops/releases/download/${SOPS_VERSION}/sops-${SOPS_VERSION}.linux.amd64" \
  -o /tmp/sops
sudo mv /tmp/sops /usr/local/bin/sops
sudo chmod +x /usr/local/bin/sops

echo "== pm2 (менеджер процессов — держит сайт запущенным) =="
sudo npm install -g pm2

echo
echo "Готово. Проверка версий:"
node --version
sops --version
age --version
pm2 --version
echo
echo "Дальше — см. deploy/README.md: перенос age-ключа, клонирование"
echo "репозитория, первый деплой."
