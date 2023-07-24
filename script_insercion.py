import requests
import json
import os

# Ruta del archivo JSON
json_file = "propiedades2.json"

# Obtener la ruta absoluta del archivo
ruta_absoluta = os.path.abspath(json_file)

# Imprimir la ruta absoluta
print("Ruta absoluta del archivo:", ruta_absoluta)


# Abrir y cargar el archivo JSON
with open(ruta_absoluta, "r", encoding="utf-8") as file:
    json_list = json.load(file)


# URL del endpoint donde se hará la petición POST
url = "http://localhost:8000/register/property/"

headers = {"Content-Type": "application/json; charset=utf-8"}


# Realizar la petición POST para cada JSON en la lista
for json_data in json_list:
    try:
        response = requests.post(url, json=json_data, headers=headers)
        response.raise_for_status()
        print(f"Peticion POST exitosa para el JSON: {json_data['id']}")
        print(f"Respuesta del servidor: {response.text}")
        print("-" * 40)
    except requests.exceptions.RequestException as e:
        print(f"Error en la petición para el JSON {json_data['id']}: {e}")
