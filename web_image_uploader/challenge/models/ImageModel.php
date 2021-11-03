<?php
class ImageModel
{
    public $file;

    public function __construct($file)
    {
        $this->file = $file;
    }

    public function isValidImage($original = null)
    {
        $file_ext  = '.png';
        $file_name = $original ?? $this->file->getFileName();

        return substr($file_name, -strlen($file_ext)) === $file_ext;
    }

    public function getFile()
    {
        if (!$this->isValidImage())
        {
            return 'invalid_image';
        }
        return base64_encode($this->file->getContents());
    }

    public function __destruct()
    {
        if (!empty($this->file))
        {
            $file_name = $this->file->getFileName();
            if (is_null($file_name))
            {
                $error = 'Something went wrong. Please try again later.';
                header('Location: /?error=' . urlencode($error));
                exit;
            }
            else
            {
                // fix image permissions
                exec("chmod 777 ${file_name}");
            }
        }
    }
}