
# 📦 Warehouse Management System API

A **production-ready backend API** for managing warehouses, storage zones, racks, and bins.
Built using **Django, Django REST Framework, PostgreSQL, Docker, and CI/CD with GitHub Actions**.

This project demonstrates **backend system design, REST API development, database modeling, containerization, and automated testing**.

---

# 🚀 Features

* 🔐 **JWT Authentication**
* 🏭 Warehouse management
* 📦 Storage type management
* 🗂 Zone management inside warehouses
* 🗄 Rack management inside zones
* 📥 Bin management with capacity validation
* 📊 Automatic bin availability tracking
* 🔍 Filtering warehouses by location
* 📑 API documentation with Swagger
* 🧪 Automated testing using Pytest
* 🐳 Docker containerization
* ⚙️ CI/CD pipeline using GitHub Actions

---

# 🏗 Project Architecture

```
Warehouse Management System

accounts/
    authentication (JWT)

warehouse/
    warehouse
    storage types
    zones
    racks
    bins

products/
    product management

orders/
    order processing
```

---

# 🛠 Tech Stack

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| Python 3.11           | Backend language          |
| Django                | Web framework             |
| Django REST Framework | API development           |
| PostgreSQL            | Database                  |
| JWT                   | Authentication            |
| Docker                | Containerization          |
| Pytest                | Testing                   |
| GitHub Actions        | CI/CD                     |
| drf-yasg              | Swagger API documentation |

---

# 🗄 Database Structure

Main entities:

* **User**
* **Warehouse**
* **StorageType**
* **Zone**
* **Rack**
* **Bin**

Example relationship:

```
Warehouse
   │
   └── Zone
         │
         └── Rack
               │
               └── Bin
```

Each **Bin** has:

* `max_capacity`
* `current_capacity`
* `is_available`

Database constraints ensure:

```
current_capacity >= 0
current_capacity <= max_capacity
```

---

# ⚙️ Installation

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/warehouse-management.git

cd warehouse-management
```

---

## 2️⃣ Create virtual environment

```bash
python -m venv venv
```

Activate environment

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

---

## 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Run migrations

```bash
python manage.py migrate
```

---

## 5️⃣ Run the server

```bash
python manage.py runserver
```

Server will start at

```
http://127.0.0.1:8000
```

---

# 🐳 Run With Docker

Build containers

```bash
docker-compose build
```

Start containers

```bash
docker-compose up
```

Services started:

```
Django App
PostgreSQL Database
```

---

# 📑 API Documentation

Swagger documentation available at:

```
http://127.0.0.1:8000/swagger/
```

This provides interactive API testing.

---

# 🧪 Running Tests

Tests are written using **pytest** and **pytest-django**.

Run tests:

```bash
pytest
```

Testing includes:

* Model testing
* API endpoint testing
* Authentication testing
* Database validation testing

Fixtures are used to create reusable test data.

---

# 🔄 Continuous Integration

CI is configured using **GitHub Actions**.

Pipeline runs automatically on:

```
push
pull request
```

CI pipeline performs:

```
Install dependencies
Start PostgreSQL service
Run migrations
Execute pytest tests
```

---

# 📂 Project Structure

```
warehouse-management/

accounts/
products/
orders/
warehouse/

tests/
    conftest.py
    test_models.py
    test_views.py

docker-compose.yml
Dockerfile
requirements.txt
manage.py
```

---

# 🧠 Learning Outcomes

This project helped develop skills in:

* Backend API architecture
* Django ORM modeling
* Database constraints
* Docker containerization
* CI/CD pipelines
* Automated testing
* REST API design

---

# 👨‍💻 Author

**Rakesh**

Backend Developer
Python | Django | REST APIs | PostgreSQL | Docker
