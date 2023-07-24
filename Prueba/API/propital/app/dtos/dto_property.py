import json

from app.models import PropertyModel


class PropertyDto:
    """
    Data Transfer Object (DTO) for transforming PropertyModel data into a JSON representation.

    This DTO class provides a method to convert a PropertyModel object into a JSON-formatted dictionary,
    containing the essential property information.

    Attributes:
        None (This DTO does not have any specific attributes.)
    """

    def __init__(self) -> None:
        """
        Initialize the PropertyDto.

        Args:
            None (This method does not take any arguments.)
        """
        pass

    def get_data(self, property_model: PropertyModel) -> dict:
        """
        Transform PropertyModel data into a JSON-formatted dictionary.

        This method takes a PropertyModel object and converts it into a dictionary with a JSON-like structure,
        containing essential property information.

        Args:
            property_model (PropertyModel): Property data model representing a single property.

        Returns:
            dict: Transformed data as a JSON-formatted dictionary.
        """

        data = {
            "id": property_model["id"],
            "address": property_model["address"],
            "price": property_model["price"],
            "bedrooms": property_model["bedrooms"],
            "bathrooms": property_model["bathrooms"],
            "size_sqft": property_model["size_sqft"],
            "location": property_model["location"],
            "terrain_type": property_model["terrain_type"],
            "is_offer": property_model["is_offer"],
            "discount": property_model["discount"],
            "description": property_model["description"],
            "details": {
                "year_built": property_model["details"]["year_built"]
                if "details" in property_model
                and "year_built" in property_model["details"]
                else None,
                "garage": property_model["details"]["garage"]
                if "details" in property_model and "garage" in property_model["details"]
                else None,
                "pool": property_model["details"]["pool"]
                if "details" in property_model and "pool" in property_model["details"]
                else None,
            },
        }

        return data
