<div class="nav-side-menu">
    <div class="menu-list">
        <ul id="menu-content" class="menu-content collapse out">

                <?php
                $menu['Locked']['pass'] = '1234';
                $i = 0;
                    foreach($menu as $category=>$catArray)
                    {
                        isset($catArray['pass']) ? $data_pass = $catArray['pass'] : $data_pass = '';

                        echo '<li class="menu-item" data-toggle="collapse" data-target="#target'.$i.'">
                                <a href="#">'.$category. '</a> 
                                <span class="arrow"></span> 
                                <ul class="sub-menu collapse in" id="target'.$i.'">
                              </li>';
                        echo '';

                           echo '<li folder-name="'. $catArray[0] .'" data-pass="'. $data_pass .'">' . $catArray[0] . '</li>' ;

                        echo '</ul>';
                        $i++;
                    }
                ?> 

                <span id="count1" class="theCount"></span>
                <span id="count2"></span>
                <span id="count3"></span>
                <span id="count4"></span>
                <input type="hidden" id="hiddenVal" value="0">
                
                <span class="lockbox">
                    <span class="lock"></span>
                </span>

            <li class="menu-item menu-overview active seleted"> <a href="#"><i class="fa fa-gift fa-lg"></i> Radar</a></li>
        </ul>
    </div>
    <div class="version"> Version 1.0 </div>
</div>

