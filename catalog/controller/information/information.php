<?php
class ControllerInformationInformation extends Controller {
	public function index() {
		$this->load->language('information/information');

		$this->load->model('catalog/information');

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/home')
		);

		if (isset($this->request->get['information_id'])) {
			$information_id = (int)$this->request->get['information_id'];
		} else {
			$information_id = 0;
		}

		$data['informationId'] = $information_id;


		$information_info = $this->model_catalog_information->getInformation($information_id);


        /*fronG*/
        $this->load->language('information/category');
        $this->load->model('extension/module/optimblog_category');
        $this->load->model('catalog/category');
        $this->load->model('extension/module/optimblog_information');

        // Information
        $data['opm_informations'] = array();

        $data['categories'] = array();

        $categories = $this->model_catalog_category->getCategories(0);
        $categories_items = array();
        $filter_data = array();
        foreach ($categories as $category) {
            if (!$category['information']) {
                continue;
            }

            $filter_data = array(
                'filter_category_id' => $category['category_id'],
            );

            $data['categories'][] = array(
                'category_id' => $category['category_id'],
                'name'        => $category['name'] . ($this->config->get('module_optimblog_information_count') ? ' (' . $this->model_extension_module_optimblog_information->getTotalInformations($filter_data) . ')' : ''),
                'href'        => $this->url->link('product/category', 'path=' . $category['category_id'])
            );
            $categories_items[] = array(
                'category_id' => $category['category_id'],
                'name'        => $category['name'] . ($this->config->get('module_optimblog_information_count') ? ' (' . $this->model_extension_module_optimblog_information->getTotalInformations($filter_data) . ')' : ''),
                'href'        => $this->url->link('product/category', 'path=' . $category['category_id'])
            );
        }


        $results = $this->model_extension_module_optimblog_information->getInformations($filter_data);
        $data['test2'] = $results;
        $opm_informations = array();
        foreach ($results as $resultat) {
            $data['opm_informations'][] = array(
                'information_id' => $resultat['information_id'],
            );
            $opm_informations[] = array(
                'information_id' => $resultat['information_id'],
            );

        }
        $itCatalog = false;
        $data['itCatalog'] = false;
        foreach ($opm_informations as $ttt){
            if ($ttt['information_id'] == $information_id){
                $itCatalog = true;
                $data['itCatalog'] = true;
                $results = $this->model_extension_module_optimblog_information->getInformationRelated($ttt['information_id']);
                $data['related'] = array();
                foreach ($results as $result) {
                    if ($result['image']) {
                        $image = $this->model_tool_image->resize($result['image'], $this->config->get('module_optimblog_image_related_width'), $this->config->get('module_optimblog_image_related_height'));
                    } else {
                        $image = false;
                    }

                    if ($this->config->get('module_optimblog_review_status')) {
                        $rating = (int)$result['rating'];
                    } else {
                        $rating = false;
                    }

                    $data['related'][] = array(
                        'related_id' => $result['information_id'],
                        'thumb'          => $image,
                        'title'          => $result['title'],
                        'description'    => !empty($result['short_description']) ? trim(html_entity_decode($result['short_description'], ENT_QUOTES, 'UTF-8')) : utf8_substr(trim(strip_tags(html_entity_decode($result['description'], ENT_QUOTES, 'UTF-8'))), 0, $this->config->get('module_optimblog_information_description_length')) . '..',
                        'user_id'        => $result['user_id'],
                        'author'         => $result['author'],
                        'date_added'     => date($this->language->get('date_format_short'), strtotime($result['date_added'])),
                        'reviews'        => sprintf($this->language->get('text_related_reviews'), $result['reviews']),
                        'rating'         => $result['rating'],
                        'href'           => $this->url->link('information/information', 'information_id=' . $result['information_id'])
                    );
                }

                $information_info = $this->model_catalog_information->getInformation($ttt['information_id']);
                if ($information_info['image']) {
//                    $image = $this->model_tool_image->resize($information_info['image'], $this->config->get('module_optimblog_image_additional_width'), $this->config->get('module_optimblog_image_additional_height'));
                    $image = $information_info['image'];
                } else {
                    $image = false;
                }
                $data['info'] = array(
                    'cat'            => $categories_items,
                    'thumb'          => $image,
                    'description' => html_entity_decode($information_info['description'], ENT_QUOTES, 'UTF-8'),
                    'author'         => $information_info['author'],
                    'date_added'     => date($this->language->get('date_format_short'), strtotime($information_info['date_added'])),
                );
            }
        }

        /*fronG*/


		$data['informations'] = array();

        $results = $this->model_catalog_information->getInformation($information_id);

        foreach ($results as $result) {
            if ($result['image']) {
                $image = $this->model_tool_image->resize($result['image'], $this->config->get('module_optimblog_image_related_width'), $this->config->get('module_optimblog_image_related_height'));
            } else {
                $image = false;
            }

            if ($this->config->get('module_optimblog_review_status')) {
                $rating = (int)$result['rating'];
            } else {
                $rating = false;
            }

            $data['informations'][] = array(
                'is_catalog'     => $itCatalog,
                'information_id' => $result['information_id'],
                'thumb'          => $image,
                'title'          => $result['title'],
                'description'    => !empty($result['short_description']) ? trim(html_entity_decode($result['short_description'], ENT_QUOTES, 'UTF-8')) : utf8_substr(trim(strip_tags(html_entity_decode($result['description'], ENT_QUOTES, 'UTF-8'))), 0, $this->config->get('module_optimblog_information_description_length')) . '..',
                'user_id'        => $result['user_id'],
                'author'         => $result['author'],
                'date_added'     => date($this->language->get('date_format_short'), strtotime($result['date_added'])),
                'reviews'        => sprintf($this->language->get('text_related_reviews'), $result['reviews']),
                'rating'         => $result['rating'],
                'href'           => $this->url->link('information/information', 'information_id=' . $result['information_id'])
            );
        }


		if ($information_info) {
			$this->document->setTitle($information_info['meta_title']);
			$this->document->setDescription($information_info['meta_description']);
			$this->document->setKeywords($information_info['meta_keyword']);

			$data['breadcrumbs'][] = array(
				'text' => $information_info['title'],
				'href' => $this->url->link('information/information', 'information_id=' .  $information_id)
			);

			$data['heading_title'] = $information_info['title'];

			$data['description'] = html_entity_decode($information_info['description'], ENT_QUOTES, 'UTF-8');

			$data['continue'] = $this->url->link('common/home');

			$data['column_left'] = $this->load->controller('common/column_left');
			$data['column_right'] = $this->load->controller('common/column_right');
			$data['content_top'] = $this->load->controller('common/content_top');
			$data['content_bottom'] = $this->load->controller('common/content_bottom');
			$data['footer'] = $this->load->controller('common/footer');
			$data['header'] = $this->load->controller('common/header');

			$this->response->setOutput($this->load->view('information/information', $data));
		} else {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('text_error'),
				'href' => $this->url->link('information/information', 'information_id=' . $information_id)
			);

			$this->document->setTitle($this->language->get('text_error'));

			$data['heading_title'] = $this->language->get('text_error');

			$data['text_error'] = $this->language->get('text_error');

			$data['continue'] = $this->url->link('common/home');

			$this->response->addHeader($this->request->server['SERVER_PROTOCOL'] . ' 404 Not Found');

			$data['column_left'] = $this->load->controller('common/column_left');
			$data['column_right'] = $this->load->controller('common/column_right');
			$data['content_top'] = $this->load->controller('common/content_top');
			$data['content_bottom'] = $this->load->controller('common/content_bottom');
			$data['footer'] = $this->load->controller('common/footer');
			$data['header'] = $this->load->controller('common/header');

			$this->response->setOutput($this->load->view('error/not_found', $data));
		}
	}

	public function agree() {
		$this->load->model('catalog/information');

		if (isset($this->request->get['information_id'])) {
			$information_id = (int)$this->request->get['information_id'];
		} else {
			$information_id = 0;
		}

		$output = '';

		$information_info = $this->model_catalog_information->getInformation($information_id);

		if ($information_info) {
			$output .= html_entity_decode($information_info['description'], ENT_QUOTES, 'UTF-8') . "\n";
		}

		$this->response->addHeader('X-Robots-Tag: noindex');

		$this->response->setOutput($output);
	}
}
