<?php
class ControllerExtensionModuleCategory extends Controller {
	public function index() {
        $data['home_url'] = $_SERVER['REQUEST_URI'];
        $data['route'] = isset($this->request->get['route']);
        $this->load->language('extension/module/category');
        $this->load->model('tool/image');
		if (isset($this->request->get['path'])) {
			$parts = explode('_', (string)$this->request->get['path']);
		} else {
			$parts = array();
		}

		if (isset($parts[0])) {
			$data['category_id'] = $parts[0];
		} else {
			$data['category_id'] = 0;
		}

		if (isset($parts[1])) {
			$data['child_id'] = $parts[1];
		} else {
			$data['child_id'] = 0;
		}

		$this->load->model('catalog/category');

		$this->load->model('catalog/product');

		$data['categories'] = array();
		$data['home_categories'] = array();

		$categories = $this->model_catalog_category->getCategories(0);



		foreach ($categories as $category) {
			$children_data = array();

			if ($category['category_id'] == $data['category_id']) {
				$children = $this->model_catalog_category->getCategories($category['category_id']);

				foreach($children as $child) {
					$filter_data = array('filter_category_id' => $child['category_id'], 'filter_sub_category' => true);

					$children_data[] = array(
						'category_id' => $child['category_id'],
                        'child_image' => $child['image'],
						'name' => $child['name'] . ($this->config->get('config_product_count') ? ' (' . $this->model_catalog_product->getTotalProducts($filter_data) . ')' : ''),
						'href' => $this->url->link('product/category', 'path=' . $category['category_id'] . '_' . $child['category_id'])
					);
				}
			}

			$filter_data = array(
				'filter_category_id'  => $category['category_id'],
				'filter_sub_category' => true
			);

			$data['categories'][] = array(
				'category_id' => $category['category_id'],
				'category_image' => $category['image'],
				'name'        => $category['name'] . ($this->config->get('config_product_count') ? ' (' . $this->model_catalog_product->getTotalProducts($filter_data) . ')' : ''),
				'children'    => $children_data,
				'href'        => $this->url->link('product/category', 'path=' . $category['category_id'])
			);
		}

        foreach ($this->model_catalog_category->getCategories(0) as $home_category) {
            if ($home_category['top']) {
                // Level 2
                $children_data = array();

                $children = $this->model_catalog_category->getCategories($home_category['category_id']);

                foreach ($children as $child) {
                    $filter_data = array(
                        'filter_category_id'  => $child['category_id'],
                        'filter_sub_category' => true
                    );

                    if ($child['image']) {
                        $image = $this->model_tool_image->resize($child['image'], $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_width'), $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_height'));
                    } else {
                        $image = $this->model_tool_image->resize('placeholder.png', $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_width'), $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_height'));
                    }

                    $children_data[] = array(
                        'name'  => $child['name'] . ($this->config->get('config_product_count') ? ' (' . $this->model_catalog_product->getTotalProducts($filter_data) . ')' : ''),
                        'image2' => $child['image'],
                        'image' => $image,
                        'href'  => $this->url->link('product/category', 'path=' . $home_category['category_id'] . '_' . $child['category_id'])
                    );
                }

                if ($category['image']) {
                    $image = $this->model_tool_image->resize($category['image'], $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_width'), $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_height'));
                } else {
                    $image = $this->model_tool_image->resize('placeholder.png', $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_width'), $this->config->get('theme_' . $this->config->get('config_theme') . '_image_product_height'));
                }

                // Level 1
                $data['home_categories'][] = array(
                    'id'       =>$home_category['category_id'],
                    'image2' => $category['image'],
                    'image' => $image,
                    'name'     => $home_category['name'],
                    'children' => $children_data,
                    'column'   => $home_category['column'] ? $home_category['column'] : 1,
                    'href'     => $this->url->link('product/category', 'path=' . $home_category['category_id'])
                );
            }
        }

		return $this->load->view('extension/module/category', $data);
	}
}