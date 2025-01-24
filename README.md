# Test Banco Bogotá

## Descripción

Este proyecto es una aplicación de ejemplo para la gestión de productos, construida con Java y Spring Boot. Utiliza Maven como herramienta de construcción y gestión de dependencias.

## Estructura del Proyecto

- **src/main/java**: Contiene el código fuente principal de la aplicación.
    - **com.test.banco.bogota.app.controller**: Controladores REST.
    - **com.test.banco.bogota.app.dto**: Clases DTO (Data Transfer Object).
    - **com.test.banco.bogota.app.service**: Servicios de negocio.
    - **com.test.banco.bogota.app.exception**: Clases de manejo de excepciones.
- **src/test/java**: Contiene las pruebas unitarias y de integración.
    - **com.test.banco.bogota.app.controller**: Pruebas de los controladores REST.


## Requisitos

- Java 17
- Maven 3.6.3 o superior

## Instalación

1. Clona el repositorio:
   ```sh
    https://github.com/JoseGerardo105/InventoryUI   

2. Navega al directorio del proyecto:
   ```sh
    cd test-banco-bogota


3. Compila el proyecto y descarga las dependencias:
    ```sh
    mvn clean install


4. Ejecuta la aplicación:
    ```sh
    mvn spring-boot:run

La aplicación estará disponible en http://localhost:8080.

5. Pruebas:
Para ejecutar las pruebas unitarias y de integración, usa el siguiente comando:
    ```sh
    mvn test

## Endpoints

### Obtener todos los productos
- **URL**: `/api/products`
- **Método**: `GET`
- **Respuesta**: Lista de productos

### Obtener un producto por ID
- **URL**: `/api/products/{id}`
- **Método**: `GET`
- **Respuesta**: Producto con el ID especificado

### Crear un nuevo producto
- **URL**: `/api/products`
- **Método**: `POST`
- **Cuerpo**: JSON con los datos del producto
- **Respuesta**: Producto creado
- **Cuerpo**: JSON con los datos del producto:
  ```json
  {
    "name": "Producto de ejemplo",
    "description": "Descripción del producto de ejemplo",
    "price": 100.0,
    "quantity": 10
  }

### Actualizar un producto
- **URL**: `/api/products/{id}`
- **Método**: `PUT`
- **Cuerpo**: JSON con los datos actualizados del producto
- **Respuesta**: Producto actualizado
- **Cuerpo**: JSON con los datos del producto:
  ```json
  {
    "name": "Producto de ejemplo",
    "description": "Descripción del producto de ejemplo",
    "price": 100.0,
    "quantity": 10
  }

### Eliminar un producto
- **URL**: `/api/products/{id}`
- **Método**: `DELETE`
- **Respuesta**: Confirmación de eliminación