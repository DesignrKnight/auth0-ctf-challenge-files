<!DOCTYPE html>
<html lang="en">
<head>
    <title>Image Uploader</title>
    <meta name="author" content="makelaris, makelarisjr">
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"/>
</head>
<body class="bg-gray-900">
    <div id="app" class="flex flex-col py-8 justify-center items-center">
        <h1 class="py-4 mb-4 text-white text-3xl">
            Image Uploader
        </h1>
        <div class="flex flex-col justify-center items-center h-full">
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="flex flex-col justify-center items-center max-w-5xl">
                    <img src="data:image/png;base64,<?= $image ?>">
                </div>
            </div>
        </div>
    </div>
</body>
</html>