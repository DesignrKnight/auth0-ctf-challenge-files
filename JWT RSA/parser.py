import binascii
import base64

print(
    int(
        binascii.hexlify(
            base64.urlsafe_b64decode(
                "qEs6vGcCR9xUrfSoh4TM2YgVfuw8DApcohm2FHF6njCZpcTGK65fXX7WA9QS-4SJd9hPHt4w1chUa72csGyAbmOu44GYOclLfOcUA3ZlkTKE-j_phEpnpgGXVeKgoXlzznazCFJ7TMOCSIbqBzEXJ8UQKz6R31aF7sEbiJecU0vaHEtth3nf_4X2tCblAZ9DF3g7krvxy5lllHOHzFY1XonQH0PSJHh5JqzngwiH1JHEz7XXuHJLKzQ14ehOKOyypjjL-lhsDP6wwL5QXzOZrtyyJySpS3UV81myb5xY79_e9OBwfnF-bKVjDpH_UQd_JVNiHuw_YtPCM3l4VGDp-Q=="
            )
        ),
        16,
    )
)
