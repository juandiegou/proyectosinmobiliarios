from bson.objectid import ObjectId
from app.models import PropertyModel
from app.dtos import PropertyDto
from database.repositories import PropertyRepository


class PropertyController:
    """
    Controller for managing property-related operations.

    This controller class provides methods to interact with property data,
    including inserting, updating, and retrieving property records.

    Attributes:
        properties (PropertyRepository): An instance of the PropertyRepository
            class, responsible for handling database operations related to properties.
    """

    properties: PropertyRepository = PropertyRepository("properties")

    def __init__(self) -> None:
        """
        Initialize the PropertyController with a PropertyRepository instance.
        """
        self.properties = PropertyRepository("properties")

    def insert_property(self, property_data: PropertyModel) -> object:
        """
        Insert a new property record into the database.

        Args:
            property_data (PropertyModel): The property data to be inserted.

        Returns:
            object: The inserted property data.
        """
        property_created = PropertyDto()
        inserted_id = self.properties.insert_one(dict(property_data))
        inserted_document = self.properties.find_one({"_id": inserted_id})
        return property_created.get_data(inserted_document)

    def get_by_name(self, name: str) -> PropertyModel:
        """
        Retrieve a property record by its name.

        Args:
            name (str): The name of the property to retrieve.

        Returns:
            PropertyModel: The property record matching the provided name.
        """
        return self.properties.get_by_id(name)

    def update_property(self, property_id: int, property: dict) -> object:
        """
        Update an existing property record.

        Args:
            property_id (int): The ID of the property to be updated.
            property (dict): The updated property data.

        Returns:
            object: The updated property data.
        """
        property_updated = PropertyDto()
        updated = self.properties.update_one(
            {"id": property_id}, {"$set": dict(property)}
        )
        return property_updated.get_data(updated)

    def delete_property(self, property_id: int):
        """
        Delete a property record by its ID.

        Args:
            property_id (int): The ID of the property to be deleted.
        """
        deleted = self.properties.delete_one({"id": property_id})
        return deleted

    def get_all(self) -> [PropertyModel]:
        """
        Retrieve all property records from the database.

        Returns:
            list[PropertyModel]: A list of all property records available in the database.
        """
        all_data = PropertyDto()
        all_properties = self.properties.get_all()
        data = []
        for property_item in all_properties:
            data.append(all_data.get_data(property_item))
        return data

    def get_by_tag(self, query: dict) -> [PropertyModel]:
        """
        Retrieve property records based on specific filter criteria.

        Args:
            query (dict): A dictionary containing filter criteria for property retrieval.

        Returns:
            list[PropertyModel]: A list of property records that match the provided filter criteria.
        """
        all_data_by_tag = PropertyDto()
        all_properties = self.properties.get_all_by_tag(query)
        data = []
        for property_item in all_properties:
            data.append(all_data_by_tag.get_data(property_item))
        return data

    def get_property_by_id(self, property_id: int) -> object:
        """
        Retrieve a property record by its ID.

        Args:
            property_id (int): The ID of the property to retrieve.

        Returns:
            PropertyModel: The property record matching the provided ID.
        """
        return self.properties.get_by_id(property_id)
