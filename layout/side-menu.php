<div class="nav-side-menu">
    <div class="menu-list">
        <ul id="menu-content" class="menu-content collapse out">

                <?php
                $i = 0;
                foreach($menu as $category=>$catArray)
                {
                    echo '<li class="menu-item" data-toggle="collapse" data-target="#target'.$i.'">
                            <a href="#">'.$category. '</a> 
                            <span class="arrow"></span> 
                            <ul class="sub-menu collapse in" id="target'.$i.'">
                          </li>';
                    echo '';

                    foreach($catArray as $subItem)
                    {
                       echo '<li folder-name="'. $subItem .'">' . $subItem . '</li>' ;
                    }
                    echo '</ul>';
                    $i++;
                }
            ?>
            <li class="menu-item menu-overview active seleted"> <a href="#"><i class="fa fa-gift fa-lg"></i> Radar</a></li>
        </ul>
    </div>
    <div class="version"> Version 1.0 </div>
</div>

