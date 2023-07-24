from Crypto.Cipher import AES
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY_ENCRYPT = os.getenv('SECRET_KEY_ENCRYPT')

def encrypt(data)-> str:
    cipher = AES.new(SECRET_KEY_ENCRYPT.encode('utf-8'), AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))

    return cipher.nonce + tag + ciphertext


def decrypt(data)->str:
    nonce = data[:AES.block_size]
    tag = data[AES.block_size:AES.block_size * 2]
    ciphertext = data[AES.block_size * 2:]

    cipher = AES.new(SECRET_KEY_ENCRYPT.encode('utf-8'), AES.MODE_EAX, nonce)
    
    return cipher.decrypt_and_verify(ciphertext, tag).decode('utf-8')