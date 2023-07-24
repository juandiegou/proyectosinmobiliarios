"""
    This is a Router for a property services
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.controllers import PropertyController
from app.models import PropertyModel, QueryModel, DeletePropertyModel
from typing import Union, Tuple
from datetime import datetime
from bson import ObjectId
import json

router = APIRouter()
property_controller = PropertyController()


@router.post("/register/property", description="Create a new property registration.")
async def register_property(property: PropertyModel) -> JSONResponse:
    """
    Create a new property registration.

    This endpoint allows users to register a new property by providing the necessary details
    in the request body. The `PropertyModel` defines the expected structure of the data.

    Returns:
        A JSON response with a status code of 200 and the newly created property's data if successful.
        If there's an error inserting the property, it returns a JSON response with a status code of 500
        and an error detail message.
    """
    property_created = property_controller.insert_property(property)
    if property_created is not None:
        return JSONResponse(
            status_code=200,
            content={"detail": "property_created", "data": property_created},
        )
    return JSONResponse(status_code=500, content={"detail": "Error al insertar"})


@router.put(
    "/update/property",
    description="Update an existing property by providing the property data.",
)
async def update_property(property_data: dict) -> JSONResponse:
    """
    Update an existing property by providing the property data.

    This endpoint allows users to update an existing property by providing the updated property
    data in the request body. The `property_data` parameter should be a dictionary containing the
    updated information, including the 'id' of the property to be updated.

    Returns:
        A JSON response with a status code of 200 and the updated property's data if successful.
        If there's an error updating the property, it returns a JSON response with a status code of 500
        and an error detail message.
    """
    property_id = property_data["id"]
    updated_property = property_controller.update_property(property_id, property_data)
    if updated_property is not None:
        return JSONResponse(
            status_code=200,
            content={"detail": "property_updated", "data": updated_property},
        )
    return JSONResponse(status_code=500, content={"detail": "Error al actualizar"})


@router.get("/property/{property_id}")
async def get_by_id(
    property_id: int, description="Get property details by its ID."
) -> JSONResponse:
    """
    Get property details by its ID.

    This endpoint allows users to retrieve the details of a property based on its unique 'property_id'.
    The 'property_id' parameter is an integer representing the identifier of the property to be retrieved.

    Returns:
        A JSON response with a status code of 200 and the property details if the property with the
        given ID is found. If the property does not exist, it returns a JSON response with a status
        code of 404 and an error detail message.
    """
    property_data = property_controller.get_property_by_id(property_id)
    if property_data is not None:
        property_list = [
            json.loads(json.dumps(property_item, default=str))
            for property_item in property_data
        ]
        return JSONResponse(
            status_code=200,
            content={"detail": "property_found", "data": property_list},
        )
    return JSONResponse(status_code=404, content={"detail": "Property not found"})


@router.get("/getall", description="Retrieve all property records from the database.")
async def get_all() -> JSONResponse:
    """
    Retrieve all property records.

    This endpoint allows users to fetch all available property records from the database.

    Returns:
        A JSON response with a status code of 200 containing a list of all property records
        if records are available. If no records are found, it returns an empty list.
        In case of an error while fetching the records, a JSON response with a status code of 500
        and an error detail message will be returned.
    """
    properties = property_controller.get_all()
    if properties is not None:
        return JSONResponse(
            status_code=200, content={"detail": "sucessfull", "data": properties}
        )
    return JSONResponse(status_code=500, content={"detail": "Error al obtener datos"})


@router.delete(
    "/delete/property", description="Delete a property by providing its unique ID."
)
async def delete_property(property_id: DeletePropertyModel | dict) -> JSONResponse:
    """
    Delete a property by its ID.

    This endpoint allows users to delete a property based on its unique 'property_id'.
    The 'property_id' parameter is a dictionary that should contain the 'id' of the property to be deleted.

    Args:
        property_id (dict): A dictionary containing the 'id' of the property to be deleted.

    Returns:
        A JSON response with a status code of 200 if the property is successfully deleted.
        If the property does not exist, it returns a JSON response with a status code of 500
        and an error detail message.
    """

    deleted_property = property_controller.delete_property(property_id["id"])
    if deleted_property is not None:
        return JSONResponse(status_code=200, content={"detail": "property_deleted"})
    return JSONResponse(status_code=500, content={"detail": "Error al eliminar"})


@router.get(
    "/filter/property",
    description="Retrieve property records by applying various filters.",
)
async def get_by_filter(
    id: int | None = None,
    address: str | None = None,
    max_price: float | None = None,
    min_price: float | None = None,
    max_bedrooms: int | None = None,
    min_bedrooms: int | None = None,
    max_bathrooms: int | None = None,
    min_bathrooms: int | None = None,
    min_size_sqft: int | None = None,
    max_size_sqft: int | None = None,
    location: Tuple[float, float] | None = None,
    terrain_type: str | None = None,
    is_offer: bool | None = None,
    min_discount: float | None = None,
    max_discount: float | None = None,
    description: str | None = None,
    details: dict | None = None,
    created_at: datetime | None = None,
    updated_at: datetime | None = None,
):
    """
    Retrieve property records by applying various filters.

    This endpoint allows users to fetch property records from the database based on specific filters.
    Users can provide various filter parameters to narrow down the search results. Available filters include:
    'id', 'address', 'max_price', 'min_price', 'max_bedrooms', 'min_bedrooms', 'max_bathrooms', 'min_bathrooms',
    'min_size_sqft', 'max_size_sqft', 'location', 'terrain_type', 'is_offer', 'min_discount', 'max_discount',
    'description', 'details', 'created_at', and 'updated_at'.

    Returns:
        A JSON response with a status code of 200 containing a list of property records that match the provided filters.
        If no records are found, it returns an empty list.
        In case of an error while fetching the records, a JSON response with a status code of 500 and an error detail
        message will be returned.
    """
    filters = {}
    if id is not None:
        filters["id"] = {"$eq": id}
    if address is not None:
        filters["address"] = {"address": {"$regex": address, "$options": "i"}}
    if max_price is not None:
        filters["price"] = {"$lte": max_price}
    if min_price is not None:
        filters["price"] = {"$gte": min_price}
    if max_bedrooms is not None:
        filters["bedrooms"] = {"$lte": max_bedrooms}
    if min_bedrooms is not None:
        filters["bedrooms"] = {"$gte": min_bedrooms}
    if max_bathrooms is not None:
        filters["bathrooms"] = {"$lte": max_bathrooms}
    if min_bathrooms is not None:
        filters["bathrooms"] = {"$gte": min_bathrooms}
    if max_size_sqft is not None:
        filters["size_sqft"] = {"$lte": max_size_sqft}
    if min_size_sqft is not None:
        filters["size_sqft"] = {"$gte": min_size_sqft}
    if location is not None:
        filters["location"] = {"location": {"$eq": location, "$options": "i"}}
    if terrain_type is not None:
        filters["terrain_type"] = {
            "terrain_type": {"$eq": terrain_type, "$options": "i"}
        }
    if is_offer is not None:
        filters["is_offer"] = {"is_offer": is_offer}
    if max_discount is not None:
        filters["discount"] = {"$lte": max_discount}
    if min_discount is not None:
        filters["discount"] = {"$gte": min_discount}
    if description is not None:
        filters["description"] = {
            "description": {"$regex": description, "$options": "i"}
        }
    if details is not None:
        filters["details"] = {"details": {"$all": ["swimming pool", "garage"]}}
    if created_at is not None:
        filters["created_at"] = {"created_at": {"$gte": datetime(created_at)}}
    if updated_at is not None:
        filters["updated_at"] = {"updated_at": {"$gte": datetime(updated_at)}}
    properties = property_controller.get_by_tag(filters)
    if properties is not None:
        return JSONResponse(
            status_code=200, content={"detail": "sucesfull", "data": properties}
        )
    return JSONResponse(
        status_code=500, content={"detail": "Error o datos no encontrados"}
    )
