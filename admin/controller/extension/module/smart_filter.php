<?php
class ControllerExtensionModuleSmartFilter extends Controller {
	private $error = array();

	public function index() {
		$this->load->language('extension/module/smart_filter');

		$this->document->setTitle($this->language->get('heading_title'));

		$this->load->model('setting/setting');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
			$this->model_setting_setting->editSetting('module_smart_filter', $this->request->post);

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
		}

		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('heading_title'),
			'href' => $this->url->link('extension/module/smart_filter', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['action'] = $this->url->link('extension/module/smart_filter', 'user_token=' . $this->session->data['user_token'], true);

		$data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

		if (isset($this->request->post['module_smart_filter_status'])) {
			$data['module_smart_filter_status'] = $this->request->post['module_smart_filter_status'];
		} else {
			$data['module_smart_filter_status'] = $this->config->get('module_smart_filter_status');
		}

		if (isset($this->request->post['module_smart_filter_price'])) {
			$data['module_smart_filter_price'] = $this->request->post['module_smart_filter_price'];
		} else {
			$data['module_smart_filter_price'] = $this->config->get('module_smart_filter_price');
		}

		if (isset($this->request->post['module_smart_filter_category'])) {
			$data['module_smart_filter_category'] = $this->request->post['module_smart_filter_category'];
		} else {
			$data['module_smart_filter_category'] = $this->config->get('module_smart_filter_category');
		}
		if (isset($this->request->post['module_smart_filter_manufacturer'])) {
			$data['module_smart_filter_manufacturer'] = $this->request->post['module_smart_filter_manufacturer'];
		} else {
			$data['module_smart_filter_manufacturer'] = $this->config->get('module_smart_filter_manufacturer');
		}


		if (isset($this->request->post['module_smart_filter_option'])) {
			$data['module_smart_filter_option'] = $this->request->post['module_smart_filter_option'];
		} else {
			$data['module_smart_filter_option'] = $this->config->get('module_smart_filter_option');
		}

		if (isset($this->request->post['module_smart_filter_atribute'])) {
			$data['module_smart_filter_atribute'] = $this->request->post['module_smart_filter_atribute'];
		} else {
			$data['module_smart_filter_atribute'] = $this->config->get('module_smart_filter_atribute');
		}
		
		


		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/smart_filter', $data));
	}


	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/smart_filter')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		return !$this->error;
	}
}