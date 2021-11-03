<?php
class ImageController
{

    public function index($router)
    {
        return $router->view('upload');
    }

    public function store($router)
    {
        ini_set('file_uploads', 'On');

        if (empty($_FILES['uploadFile']))
        {
            return $router->abort(400);
        }

        $file = $_FILES['uploadFile'];
        $hash = substr(str_shuffle(md5(time())),0,5).'.png';

        $image = new ImageModel(new FileModel($file['tmp_name']));

        if (!$image->isValidImage($file['name']))
        {
            return json_encode([
                'error' => 'Invalid image. Only PNG images are supported'
            ]);
        }

        $image->file->saveFile($hash);

        return json_encode([
            'image' => "/image/${hash}"
        ]);
    }

    public function show($router, $params)
    {
        $path = preg_replace('/(&|\$|;|\|)/m', '', $params[0]);

        $image = new ImageModel(new FileModel($path));

        if (!$image->file->exists())
        {
            $router->abort(404);
        }

        $router->view('show', ['image' => $image->getFile()]);
    }
}