<?php
    $menu = [];
    $categories = glob('manuscript' . '/*' , GLOB_ONLYDIR);
    $structure = [];

    //CATEGORY LEVEL
    foreach($categories as $category) {
        $categoryName = pathinfo($category)['basename'];

        $categoryPath = glob($category . '/*' , GLOB_ONLYDIR);
        //MODULE LEVEL
        foreach ($categoryPath as $cPath) {
            $moduleNames = pathinfo($cPath)['basename'];
            //FILL MENU
            $menu[$categoryName][] = $moduleNames;

            $modulePath= glob($cPath . '/*' , GLOB_ONLYDIR);
            //FILETYPE FOLDER LEVEL
            foreach($modulePath as $mPath)
            {
                $filetype = pathinfo($mPath)['basename'];

                //FILE LEVEL
                $moduleFile = glob($mPath . '/*' , GLOB_BRACE);

                foreach ($moduleFile as $file) {
                    $filename = pathinfo($file)['basename'];
                    //$extension = pathinfo($file)['extension'];
                    $structure[$categoryName][$moduleNames][$filetype][] = $filename;

                }

            }
        }
    }

    include('layout/header.php');
    include('layout/content.php');
?>

<script type="text/javascript">
    var jsonData = <?php echo json_encode($structure); ?>;
    console.log(jsonData);
</script>
