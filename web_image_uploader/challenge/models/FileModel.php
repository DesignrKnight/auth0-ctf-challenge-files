<?php
class FileModel
{
    public $file_name;

    public function __construct($file_name)
    {
        chdir('/www/uploads');
        $this->file_name = urldecode($file_name);
    }

    public function exists()
    {
        return file_exists($this->file_name);
    }

    public function getContents()
    {
        return file_get_contents($this->file_name);
    }

    public function getFileName()
    {
        return $this->file_name;
    }

    public function saveFile($as = null)
    {
        $file_name = $as ?? $this->getFileName();

        return file_put_contents($file_name, $this->getContents());
    }
}