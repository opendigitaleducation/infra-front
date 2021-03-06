import { ng, _, angular } from '../entcore';

/**
 * @description Display pastilles that can be used as tabs.
 * @param ngModel The activated pastille index.
 * @param images An array of objects { img: string, visible: bool } containing the list of images paths and indicating if they are visible or not.
 * @example
 *  <pastilles 
        ng-model="<index>"
        images="<images>">
    </pastilles>
 */

export const pastilles = ng.directive('pastilles', ['$window', ($window) => {
    return {
        restrict: 'E',
        template: `
            <div class="spacer-medium invisible-content">
                <a ng-if="image.visible" class="absolute-w round bg-white square-large img-shadow high-index inactive" ng-click="" ng-repeat="image in images track by $index">
                    <img skin-src="[[ image.img ]]"/>
                </a>
            </div>
        `,

        scope: {
            ngModel: '=',
            images: '=',
        },

        link: (scope, element, attributes) => {

            // Waiting for pastilles to be created
            setTimeout(function () {
                var i, l, count;
                var pastilles, totalWidth, pastilleWidth, leftOffset, offset, pastilleOffset, nbPastilles;
                scope.index = 0;

                var updatePastilles = function() {
                    pastilles = element.find("div").children();
                    nbPastilles = pastilles.length;
                }
                updatePastilles();

                // Update z index
                var updateZIndex = function() {
                    updatePastilles();
                    for (i = scope.index - 1, count = 0; i >= 0; i--) {
                        pastilles.eq(i).css("z-index", "" + (1000 + nbPastilles - count - 1));
                        count++;
                    }
                    for (i = scope.index + 1, count = 0; i < nbPastilles; i++) {
                        pastilles.eq(i).css("z-index", "" + (1000 + nbPastilles - count - 1));
                        count++;
                    }
                    pastilles.eq(scope.index).css("z-index", "" + (1000 + nbPastilles + 1));
                }

                // Update pastille position (also if resizing)
                var updatePastillesPosition = function() {
                    // Avoid weird left/top animation when resizing
                    updatePastilles();
                    for (i = 0; i < nbPastilles; i++)
                        pastilles.eq(i).removeClass("animated");
                    totalWidth = element.find('div').width();
                    pastilleWidth = pastilles[0].offsetWidth;
                    offset = pastilleWidth * 3 / 5;
                    leftOffset = (totalWidth - (pastilleWidth + ((nbPastilles - 1) * offset))) / 2;

                    for (i = 0; i < nbPastilles; i++) {
                        pastilles[i].originalLeft = leftOffset + (i * offset);
                        pastilles.eq(i).css("left", pastilles[i].originalLeft + "px");
                    }
                    updateZIndex();
                    setTimeout(function () {
                        for (i = 0; i < nbPastilles; i++)
                            pastilles.eq(i).addClass("animated");
                    }, 250);
                }

                scope.setActive = (e) => {
                    e.style.left = this.originalLeft - 3 + "px";
                    e.style.top = "-3px";
                    e.style.marginTop = "-3px";
                };

                scope.setInactive = (e) => {
                    e.style.left = this.originalLeft + "px";
                    e.style.top = "0px";
                    e.style.marginTop = "0px";
                };

                var updateImages = function() {
                    updatePastillesPosition();
                    if (scope.index < nbPastilles) {
                        scope.setActive(pastilles[scope.index]);
                        pastilles.eq(scope.index).removeClass("inactive");
                        pastilles.eq(scope.index).addClass("active");
                    }

                    // Centering when hovering (padding+absolute position)
                    element.find('.round').on('mouseenter', function() {
                        if (this.classList.contains("inactive"))
                            scope.setActive(this);
                    });

                    element.find('.round').on('mouseleave', function() {
                        if (this.classList.contains("inactive")) {
                            scope.setInactive(this);
                        }
                    });

                    // Set active on click
                    element.find('.round').on('click', function() {
                        updatePastilles();
                        if (nbPastilles === 0)
                            return;
                        element.find(".active").addClass("inactive");
                        element.find(".active").removeClass("active");
                        for (i = 0; i < nbPastilles; i++)
                            scope.setInactive(pastilles[i]);
                        this.classList.remove("inactive");
                        this.classList.add("active");
                        scope.setActive(this);
                        scope.index = Array.prototype.slice.call(element.find("div")[0].children).indexOf(this);
                        var c = 0;
                        for (var i = 0, l = scope.images.length; i < l; i++) {
                            if (scope.images[i].visible) {
                                if (scope.index === c) {
                                    scope.ngModel = i;
                                    break;
                                }
                                else
                                    c++;
                            }
                        }
                        updateZIndex();
                        scope.$apply();
                    });
                }

                scope.$watch(function() { return element.find('div')[0].style.width }, function(newValue) {
                    updatePastillesPosition();
                });

                angular.element($window).bind('resize', function() {
                    updatePastillesPosition();
                });

                scope.$watch('images', function(newValue) {
                    setTimeout(function () {
                        updateImages();
                    }, 0);
                }, true);
                updateImages();

                // Activate the first pastille
                scope.setActive(pastilles[0]);
                pastilles.eq(0).removeClass("inactive");
                pastilles.eq(0).addClass("active");

                element.find("div").removeClass("invisible-content");

                // Update position a last time to be sure
                setTimeout(function () {
                    updatePastillesPosition();
                }, 250);
            }, 250);
        }
    };
}]);