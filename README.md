# API de Gestión de Tareas

Esta es una API de gestión de tareas construida con Node.js, Express y MySQL. La API permite a los usuarios registrarse, iniciar sesión, crear, actualizar, eliminar y gestionar tareas, así como adjuntar archivos a las tareas y filtrarlas por categoría y estado.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
API-Node-Express/
├── node_modules/           # Dependencias del proyecto
├── uploads/                # Directorio para almacenar archivos subidos
├── .gitignore              # Archivos y directorios ignorados por Git
├── database.js             # Configuración y funciones de la base de datos
├── index.js                # Punto de entrada principal de la aplicación
├── package.json            # Información del proyecto y dependencias
├── package-lock.json       # Información detallada de las dependencias
├── README.md               # Documentación del proyecto
├── task_manager.sql        # Script SQL para crear la base de datos y tablas
├── uploadFile.js           # Configuración de multer para subir archivos
└── authRoutes.js           # Middleware para rutas de autenticación de JWT
```

## Endpoints

### Autenticación

#### Registro de usuario

- **URL:** `/register`
- **Método:** `POST`
- **Descripción:** Registra un nuevo usuario.
- **Cuerpo de la solicitud:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Respuestas:**
    - `201 Created:` Usuario registrado exitosamente.
    - `400 Bad Request:` Faltan campos requeridos.
    - `500 Internal Server Error:` Error al guardar el usuario en la base de datos.

#### Inicio de sesion

- **URL:** `/login`
- **Método:** `POST`
- **Descripción:** Inicia sesión y obtiene un token JWT.
- **Cuerpo de la solicitud:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Respuestas:**
    - `200 OK:` Inicio de sesión exitoso, devuelve el token JWT.
    - `400 Bad Request:` Faltan campos requeridos.
    - `401 Unauthorized:` Email o contraseña inválidos.
    - `500 Internal Server Error:` Error al buscar el usuario en la base de datos.

### Tareas

#### Crear tarea

- **URL:** `/createTask`
- **Método:** `POST`
- **Descripción:** Crea una nueva tarea.
- **Encabezados:**
    - `Authorization:` <vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'> Bear</vscode_annotation>er <token>
- **Cuerpo de la solicitud:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "YYYY-MM-DD",
  "status": "string",
  "category_id": "integer"
}
```
- **Archivo adjunto:** `attatchment` (Opcional, tipo: imagen o PDF, maximo 2MB) 
- **Respuestas:**
    - `201 Created:` Tarea creada exitosamente.
    - `500 Internal Server Error:` Error al crear la tarea.

#### Listar tareas

- **URL:** `/getTask`
- **Método:** `GET`
- **Descripción:** Obtiene todas las tareas del usuario autenticado.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve la listas de tareas.
    - `500 Internal Server Error:` Error al obtener las tareas.

#### Obtener detalles de una tarea

- **URL:** `/getTask/:id`
- **Método:** `GET`
- **Descripción:** Obtiene los detalles de una tarea especifica.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve los detalles de la tarea.
    - `404 Not Found:` Tarea no encontrada.
    - `500 Internal Server Error:` Error al obtener las tarea.

#### Actualizar tarea

- **URL:** `/updateTask/:id`
- **Método:** `PUT`
- **Descripción:** Actualiza una tarea existente.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Cuerpo de la solicitud:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "YYYY-MM-DD",
  "status": "string",
  "category_id": "integer"
}
```
- **Respuestas:**
    - `200 OK:` Tarea actualizada exitosamente.
    - `500 Internal Server Error:` Error al actualizar la tarea.

#### Eliminar tarea

- **URL:** `/deleteTask/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina una tarea existente.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Tarea eliminada exitosamente.
    - `500 Internal Server Error:` Error al eliminar la tarea.

### Archivos adjuntos

#### Adjuntar archivo a una tarea

- **URL:** `/tasks/:id/addFile`
- **Método:** `POST`
- **Descripción:** Adjunta archivo a una tarea.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Archivo adjunto:** `attachment` (tipo: imagen o PDF, maximo 2MB)
- **Respuestas:**
    - `200 OK:` Archivo adjuntado exitosamente.
    - `500 Internal Server Error:` Error al adjuntar el archivo.

#### Descargar archivo adjunto

- **URL:** `/tasks/:id/getFile`
- **Método:** `GET`
- **Descripción:** Descarga el archivo adjunto de una tarea.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve el archivo adjunto.
    - `404 Not Found:` Archivo adjunto no encontrado.
    - `500 Internal Server Error:` Error al obtener el archivo adjunto.

#### Eliminar archivo adjunto

#### Descargar archivo adjunto

- **URL:** `/tasks/:id/deleteFile`
- **Método:** `DELETE`
- **Descripción:** Elimina el archivo adjunto de una tarea.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Elimina el archivo adjunto exitosamente.
    - `404 Not Found:` Archivo adjunto no encontrado.
    - `500 Internal Server Error:` Error al eliminar el archivo adjunto.

### Categorias y filtrado

#### Obtener categorias

- **URL:** `/tasks/categories`
- **Método:** `GET`
- **Descripción:** Obtiene las categorias predefinidas.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve la lista de categorias.
    - `500 Internal Server Error:` Error al obtner las categorias.

#### Filtrar tareas por categoria

- **URL:** `/tasks/category/categoryId`
- **Método:** `GET`
- **Descripción:** Filtra las tareas por categoria.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve las tareas filtradas por categoria.
    - `500 Internal Server Error:` Error al filtrar las tareas.

#### Filtrar tareas por estado

- **URL:** `/tasks/status/:status`
- **Método:** `GET`
- **Descripción:** Filtra las tareas por estado.
- **Encabezados:**
    - `Authorization:` Bearer <token>
- **Respuestas:**
    - `200 OK:` Devuelve las tareas filtradas por estado.
    - `500 Internal Server Error:` Error al filtrar las tareas.

### Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/Alan2372/API-Node-Express.git
    ```

2. Navega al directorio del proyecto:
    ```sh
    cd API-Node-Express
    ```

3. Instala las dependencias:
    ```sh
    npm install
    ```

4. Configura la base de datos:
    - Utiliza el script en task_manager.sql para crear la DB, las tablas y las categorias.
    - Cambia los valores de la conexion en database.js con los de tu DB.
        ```
        host=localhost
        user=tu_usuario
        password=tu_contraseña
        database=nombre_de_tu_base_de_datos
        ```

5. Inicia el servidor:
    ```sh
    npm start
    ```

7. La API estará disponible en `http://localhost:3000`.


