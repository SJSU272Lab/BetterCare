( function( $ ) {

	$.fn.equalMinHeights = function() {
		return this.css( 'min-height', Math.max.apply( null,
			this.map( function() {
				return $( this ).height()
			} ).get()
		) );
	};

	var $loadContainer = $( '<div />' ).addClass( 'loader-container' );
	var $loader = $( '<div />' ).addClass( 'loader' );

	$loadContainer.css( {
		'width' : '200px',
		'position' : 'absolute',
		'left' : '50%',
		'margin-left' : '-100px'
	} );

	$loader.css( 'margin', '4em auto' );

	$loadContainer.prepend( $loader );

	$( document ).ready( function() {
		// Homepage
		if ( $( 'body.home' ).length ) {
			// Add a preloader graphic
			$( '#content' ).prepend( $loadContainer );
		}
	} );

	$( window ).load( function() {
		var wi = $( window ).width();
		var carousel_item_width;

		// Set the carousel item width based on screen res
		if ( wi > 768 ) {
			carousel_item_width = 241;
		} else {
			carousel_item_width = 296;
		}

		// Carousel for chart-collection posts
		$( '.post-carousel .carousel' ).flexslider( {
			animation: 'slide',
			animationLoop: true,
			reverse: false,
			itemWidth: carousel_item_width,
			itemMargin: 0,
			pausePlay: false,
			controlNav: false,
			slideshow: false,
			move: 1,
			start: function( slider ) {
				$( '.post-carousel .kffpch-hidden' ).removeClass( 'kffpch-hidden' );

				$( '.carousel li' ).equalMinHeights();

				/**
				 * Highlight the post in this carousel
				 * that is also the featured collection post
				 */
				if ( $( 'article.chart-collection' ).length ) {
					featured_collection_id = $( 'article.chart-collection' ).data( 'post-id' );
					if ( 'undefined' != typeof( featured_collection_id ) ) {
						$( '.post-carousel .carousel li a[data-post-id="' + featured_collection_id + '"]').addClass( 'active' );
					}
				}
			}
		});

		// Carousel for chart-collection post with content
		function ini_post_carousel() {
			var start_at = parseInt( carousel_configuration.slide_index ),
					sel = '.collection-slide article',
					carousel_width;

			if ( isNaN( start_at ) || start_at <= 0 ) {
				start_at = 0;
			} else if ( start_at >= $( sel ).length ) {
				start_at = $( sel ).length - 1;
			} else if ( start_at > 0 ) {
				start_at--;
			}

			if ( $( 'body.home' ).length ) {
				carousel_width = 828;
			} else {
				carousel_width = 757;
			}

			// Combat instances when an iframe's vertical scrollbar effects the size of the carousel items.
			if ( window.self !== window.top ) {
				$( 'body' ).css( 'overflow', 'hidden' );
			}

			$( '#carousel-collection' ).flexslider( {
				selector: sel,
				animation: 'slide',
				manualControls: '#menu-slides .hamburger ul li',
				controlsContainer: '#carousel-collection-navigator',
				directionNav: true,
				animationLoop: false,
				animationSpeed: 400,
				itemWidth: carousel_width,
				itemMargin: 0,
				pausePlay: false,
				controlNav: true,
				slideshow: false,
				useCSS: false,
				startAt: start_at,
				before: function( slider ) {
					if ( $( 'body.single-chart-collection' ).length ) {
						slide_index = slider.animatingTo + 1;

						if ( slide_index <= slider.count ) {
							var state_obj = { slide_index: slide_index },
									history_state_obj = History.getState();

							if ( $.isEmptyObject( history_state_obj ) || history_state_obj.slide_index != slide_index ) {
								// Assign the permalink to add to history stack
								permalink = carousel_configuration.permalink;
								push_url = permalink + ( permalink.indexOf( '?' ) >= 0 ? '&' : '?' ) + 'slide=' + slide_index;

								// Add the item to the history log
								History.pushState( state_obj, 'Slide ' + slide_index, push_url );
							}
						}
					}
				},
				after: function( slider ) {
					var pymChild = slider.data( 'pymChild' );
					if ( 'undefined' !== typeof pymChild ) {
						pymChild.sendHeight();
					}
				},
				start: function( slider ) {
					var $targetSlide = $( slider.slides[ slider.currentSlide ] ),
							headerHeight = $targetSlide.find( 'h1' ).height() || ($targetSlide.find( 'h2' ).height() + $targetSlide.find( 'h4').height() ),
							imageHeight = ( $targetSlide.find( '.entry-content img:first-child' ).height() || $targetSlide.find( '.entry-content svg:first-child' ).height() ) / 2.5,
							slideHeight = ( headerHeight + imageHeight > 0 ) ? ( headerHeight + imageHeight ) : 245;

					// Clear out a preloader (applies to homepage)
					if ( $( 'body.home' ).length && $( '.loader-container' ).length ) {
						$( '.loader-container' ).remove();
					}

					// Check the featured collection
					if ( $( '#featured-collection.kffpch-hidden' ).length ) {
						$( '#featured-collection' ).removeClass( 'kffpch-hidden' );
					}

					$( '#carousel-collection-navigator .flex-direction-nav li a' ).css( 'top', slideHeight + 'px' );

					// Set container overflow and slide visibility
					$( '#carousel-collection' ).find( '.flex-viewport' )
							.css( 'position', 'static' )
							.wrap( '<div class="relative" />' );

					// Initialize the slide description toggling
					slideDescriptionToggle();

					// Set the sharing iframe height
					setSharingIframeHeight();

					// Reset the default body overflow property
					if ( window.self !== window.top ) {
						$( 'body' ).css( 'overflow', 'visible' );
					}

					if ( 'undefined' !== typeof pym ) {
						var pymChild = new pym.Child();
						pymChild.sendHeight();
						slider.data( 'pymChild', pymChild );
					}
				}
			} );

			// Since we have no way to hook on the rendering lifecycle
			// of flexslider, force the charts to resize here
			$( window ).trigger( 'resize' );

		}

		// Initialize the post carousel
		ini_post_carousel();

		if ( $( 'body.single-chart-collection' ).length ) {
			// Bind to StateChange Event
			History.Adapter.bind( window, 'statechange', function() { // Note: We are using statechange instead of popstate
				var State = History.getState(); // Note: We are using History.getState() instead of event.state

				if ( State ) {
					slide_index = State.data.slide_index - 1;

					if ( slide_index < 0 ) {
						slide_index = 0;
					}
				} else {
					slide_index = 0;
				}

				$( '#carousel-collection' ).flexslider( slide_index );
			} );
		} // End: template check

		// Chart-collection post carousel events
		$( '.post-carousel .carousel .slides a' ).on( 'click', function( e ) {
			var postAttId = $( this ).attr( 'data-post-id' );

			e.preventDefault();

			// Remove all CSS active states
			$( this ).parent().siblings().find( 'a' ).removeClass( 'active' );

			// Update the link CSS state for this link
			$( this ).addClass( 'active' );

			// Get the height of existing post to prevent page from 'twitching' vertically
			var post_height = $( '#featured-collection' ).outerHeight();

			// Insert preloader
			$( '#featured-collection' ).append( $loadContainer );

			// Set preloader height to prevent page from 'twitching' vertically
			$( '#featured-collection' ).outerHeight( post_height );

			// Remove the existing post
			$( '#featured-collection .post-entries' ).remove();

			// Load the new post
			if ( undefined !== postAttId ) {
				$.ajax( {
					url: kffpchAjax.ajaxUrl,
					data: ( {
						action : 'kffpch_collection_post',
						post_id : postAttId
					} ),
					success: function( content ) {
						$( '#featured-collection' ).html( content );
						$( '#featured-collection' ).outerHeight( 'auto' );
						// Remove the preloader
						$loadContainer.remove();

						// Ini the carousel
						ini_post_carousel();
					}
				} );
			}
		} );

		// Chart-collection carousel view toggle
		if ( $( 'body.single-chart-collection .action-view' ).length ) {
			var $button = $( 'body.single-chart-collection .action-view button' ),
					button_default_text = 'View as article';

			// Set the text
			$button.text( button_default_text );

			// Set the click event handlers
			$( 'body.single-chart-collection' ).on( 'click', '.action-view', function() {
				if ( $( '#carousel-collection' ).hasClass( 'view-all' ) ) {
					// Remove our override style class
					$( '#carousel-collection' ).removeClass( 'view-all' );

					// Update our button text
					$button.text( button_default_text );

					// Show our carousel navigators
					$( '#carousel-collection-navigator, #menu-slides' ).css( 'visibility', 'visible' );

				} else {
					// Add our override style clss
					$( '#carousel-collection' ).addClass( 'view-all' );

					// Update our button text
					$button.text( 'View as slideshow' );

					// Slide the carousel to the first slide
					$( '.hamburger ul li:first-child' ).trigger( 'click' );

					// Hide the carousel navigators
					$( '#carousel-collection-navigator, #menu-slides' ).css( 'visibility', 'hidden' );
				}

				// Scroll the page to the top as convenience for the user
				$( 'html, body' ).animate( {
					scrollTop: $( '.entry-header > .entry-title' ).offset().top - 50
				}, 500 );

			} );
		}

		// Contact form flyout
		if ( $( '.contact-form' ).length ) {
			$( '.contact-form > div label' ).each( function( e ) {
				label_text = $( this ).text();
				$( this ).next().attr( 'placeholder', label_text.replace( '(required)', '' ) );
				$( this ).hide();
			} );
		}

		// Target blank external links
		$( '#content a, #colophon a' ).filter( function () {
			return $( this ).attr( 'href' ).indexOf( location.hostname ) == -1;
		} ).attr( 'target', 'blank' );

		// Functionality for the carousel slide description toggle
		function slideDescriptionToggle() {
			if ( $( '.toggle-description' ).length ) {
				// Move the toggle link to the excerpt area
				$( '.toggle-description' ).each( function() {
					// The excerpt wrapper
					$excerpt = $( this ).parent().prev( '.slide-excerpt' ).children().last();

					// Move link
					$( this ).detach().appendTo( $excerpt );
				} );

				// Set the click events to hide the bio information
				$( '.slide-description' ).on( 'click', '.toggle-description', function( e ) {
					e.preventDefault();

					// Get the ID that connects the link to the description
					var toggleId = $( this ).data( 'toggle-id' ),
							$description = $( '#description-' + toggleId );

					// Show the bio information
					$description.toggle();

					// Move the link and update text
					if ( $description.is( ':visible' ) ) {
						// Update link text
						$( this ).find( '.more' ).addClass( 'hide' );
						$( this ).find( '.less' ).text( '- Show less' );

						//Move link to description
						$description.children().last().append( $( this ) );

					} else {
						// Update link text
						$( this ).find( '.more' ).removeClass( 'hide' );
						$( this ).find( '.less' ).empty();

						//Move link to excerpt
						$( '#excerpt-' + toggleId ).children().last().append( $( this ) );
					}
				} );
			}
		}

		$( 'nav#access' ).meanmenu( {
			meanScreenWidth: '768'
		} );

		/**
		 * Hamburger functionality
		 */
		if ( wi < 768 ) {
			$( 'body' ).on( 'touchstart click', '.hamburger span', function( e ) {
				e.preventDefault();
				$( this ).parent().find( 'ul' ).addClass( 'show' );
			} );

			$( document ).on( 'touchstart click', 'body', function( e ) {
				if ( ! $( e.target ).is( '.hamburger span' ) && ! $( e.target ).is( '.hamburger ul.show li a' ) ) {
					$( '.hamburger ul.show' ).removeClass( 'show' );
				}
			} );
		}

		/**
		 * Highlight all content when embed sharing is focused
		 */
		$( '.connect-embed' ).on( 'focus', '.input-share-url', function() {
			var $this = $( this )

			$this.one( 'mouseup', function() {
				$this.select();
				return false;
			} ).select();
		} );

		/**
		 * Set an initial height for the sharing iframe markup
		 */
		function setSharingIframeHeight() {
			if ( $( 'article.chart-collection' ).length && ! $( 'body.kffpch-iframe' ).length ) {
				$( 'article.chart-collection' ).each( function() {
					var $that = $( this ),
							actionLinksHeight = 0,
							slideDescriptionHeight = 0;

					if ( $that.find( '.action-view' ).length ) {
						actionLinksHeight = $that.find( '.action-view button' ).outerHeight();
					}

					if ( $that.find( '.slide-description' ).length ) {
						// Get the tallest description within the carousel
						$that.find( '.slide-description' ).each( function( e ) {
							slideDescriptionHeight = slideDescriptionHeight > $( this ).outerHeight() ? slideDescriptionHeight : $( this ).outerHeight();
						} );
					}

					$( this ).find( '.connect-embed textarea' ).each( function() {
						var $this = $( this ),
								articleHeight = $that.height() - actionLinksHeight;

						if ( 0 === $this.prop( 'id' ).search( 'share-slide-url-' ) && articleHeight > slideDescriptionHeight ) {
							articleHeight -= slideDescriptionHeight;
						}

						// Set the textarea value of the object as text
						$this.val( '<iframe src="' + $( '<div/>' ).html( $this.data( 'iframe-src' ) ).text() + '" width="100%" height="' + articleHeight + '"></iframe>' );
					} );
				} );
			}
		}

		if ( ! $( '#carousel-collection' ).length ) {
			setSharingIframeHeight();
		}

	} );

} )( jQuery );
