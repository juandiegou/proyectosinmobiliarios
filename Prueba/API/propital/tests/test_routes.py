import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_register_property():
    # Simula los datos que se enviarían en la solicitud POST
    property_data = {
        "id": 11,
        "address": "606 Cedar St",
        "price": 320000,
        "bedrooms": 3,
        "bathrooms": 2,
        "size_sqft": 1800,
        "location": [35.682839, 139.759455],
        "terrain_type": "Ciudad",
        "is_offer": True,
        "discount": 0.1,
        "description": "Casa con estilo contemporáneo.",
        "details": {"year_built": 2012, "garage": "2 plazas", "pool": True},
    }

    response = client.post("/register/property", json=property_data)
    assert response.status_code == 200
    assert response.json() == {"detail": "property_created", "data": property_data}


def test_get_by_id():
    # Simula el ID de la propiedad que deseas obtener
    property_id = 11

    response = client.get(f"/property/{property_id}")
    assert response.status_code == 200

    # Verifica si la respuesta contiene los campos esperados de PropertyModel
    property_data = response.json()
    assert "_id" in property_data["data"].pop()


def test_update_property():
    property_id = 1  # Replace with the ID of an existing property in your database
    data = {"id": 11, "address": "Ceasr 67 St", "price": 320000, "bedrooms": 5}
    response = client.put("/update/property", json=data)
    assert response.status_code == 200
    assert response.json()["detail"] == "property_updated"


# Example test for the filter endpoint
def test_get_by_filter():
    # Test fetching properties using filters
    response = client.get(
        "/filter/property",
        params={"max_price": 250000, "min_bedrooms": 2, "max_bathrooms": 2},
    )
    assert response.status_code == 200
