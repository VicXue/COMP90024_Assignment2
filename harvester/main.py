import logging
import datetime
import time

from ibm_cloud_sdk_core import ApiException
from ibmcloudant.cloudant_v1 import CloudantV1, Document

def main():
    # Set logging level to show only critical logs
    logging.basicConfig(level=logging.DEBUG)
    logging.debug("Entered Main")

    # 1. Create a client with `CLOUDANT` default service name =============
    client = CloudantV1.new_instance()

    # 2. Create a database ================================================
    example_db_name = "orders"

    # Try to create database if it doesn't exist
    try:
        put_database_result = client.put_database(
            db=example_db_name
        ).get_result()
        if put_database_result["ok"]:
            print(f'"{example_db_name}" database created.')
    except ApiException as ae:
        if ae.code == 409:
            logging.warn(f'Cannot create "{example_db_name}" database, ' +
                'it already exists.')
    
    example_doc_id = "example_1"

    try:
        document = client.get_document(
            db=example_db_name,
            doc_id=example_doc_id
        ).get_result()
        logging.debug(f"retrieved document: {document}")
        document["joined"] = datetime.datetime.utcnow().isoformat()

    except ApiException as ae:
        if ae.code == 404:
            logging.warn(f'Cannot retrieve doc: "{example_doc_id}", ' +
                'it does not exist.')
            # 3. Create a document ================================================
            # Create a document object with "example" id
            # Setting `id` for the document is optional when "post_document"
            # function is used for CREATE. When `id` is not provided the server
            # will generate one for your document.
            document: Document = Document(id=example_doc_id)
            # Add "name" and "joined" fields to the document
            document.name = "Bob Smith"
            document.joined = datetime.datetime.utcnow().isoformat()
    

    # Save the document in the database with "post_document" function
    create_document_response = client.post_document(
        db=example_db_name,
        document=document
    ).get_result()

    # =====================================================================
    # Note: saving the document can also be done with the "put_document"
    # function. In this case `doc_id` is required for a CREATE operation:
    """
    create_document_response = client.put_document(
        db=example_db_name,
        doc_id=example_doc_id,
        document=example_document
    ).get_result()
    """
    # =====================================================================

    # Keeping track of the revision number of the document object
    # is necessary for further UPDATE/DELETE operations:
    if document is Document:
        document.rev = create_document_response["rev"]
    else:
        document["rev"] = create_document_response["rev"]
    print(f'You have created the document:\n{document}')
    time.sleep(3600)

if __name__ == "__main__":
    main()