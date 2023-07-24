from typing import Tuple
from pydantic import BaseModel


class DeletePropertyModel(BaseModel):
    """
    Pydantic model representing the data for deleting a property.

    This Pydantic model class defines the structure of the data needed to delete a property.
    It is used to ensure type validation and data consistency when handling property deletion.

    Attributes:
        id (int): The unique identifier of the property to be deleted. The value should be provided as a dictionary
            with the key "id" and its corresponding integer value, e.g., {"id": 123}.

    Methods:
        None
    """

    id: int
