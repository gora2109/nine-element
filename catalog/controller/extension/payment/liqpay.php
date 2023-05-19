<?php
include 'LiqPaySDK.php';

class ControllerExtensionPaymentLiqPay extends Controller {
	public function index() {

		$this->load->model('checkout/order');

		$order_info = $this->model_checkout_order->getOrder($this->session->data['order_id']);

		$liqpay = new LiqPay($this->config->get('payment_liqpay_merchant'), $this->config->get('payment_liqpay_signature'));
		$data = $liqpay->cnb_form_raw(array(
		'action'         => 'pay',
		'amount'         => $this->currency->format($order_info['total'], $order_info['currency_code'], $order_info['currency_value'], false),
		'currency'       => $order_info['currency_code'],
		'description'    => $this->config->get('config_name') . ' ' . $order_info['payment_firstname'] . ' ' . $order_info['payment_address_1'] . ' ' . $order_info['payment_address_2'] . ' ' . $order_info['payment_city'] . ' ' . $order_info['email'],
		'order_id'       => $this->session->data['order_id'],
		'version'        => '3',
		'result_url'     => $this->url->link('extension/payment/liqpay/renderstatus', '', true),
		'server_url'     => $this->url->link('extension/payment/liqpay/callback', '', true)
		));
		$data['button_confirm'] = $this->language->get('button_confirm');

		return $this->load->view('extension/payment/liqpay', $data);
	}

	public function renderstatus() {
		if ( $this->request->post ) {
			$liqpay = new LiqPay($this->config->get('payment_liqpay_merchant'), $this->config->get('payment_liqpay_signature'));
			$data = $this->request->post['data'];
			$parsed_data = $liqpay->decode_params($data);

			$calculated_signature = $liqpay->str_to_sign($this->config->get('payment_liqpay_signature') . $data . $this->config->get('payment_liqpay_signature'));

			if ($this->request->post['signature'] == $calculated_signature){
				if($parsed_data['status'] == 'success'){
					$this->response->redirect($this->url->link('checkout/success', '', true));
				}
				else {
					$this->response->redirect($this->url->link('checkout/failure', '', true));
				}
			}
		}
	}

	public function callback() {
		$liqpay = new LiqPay($this->config->get('payment_liqpay_merchant'), $this->config->get('payment_liqpay_signature'));
		$data = $this->request->post['data'];
		$signature = $this->request->post['signature'];
		$calculated_signature = $liqpay->str_to_sign($this->config->get('payment_liqpay_signature') . $data . $this->config->get('payment_liqpay_signature'));

		if ($signature == $calculated_signature){
			$parsed_data = $liqpay->decode_params($data);
			$this->load->model('checkout/order');
			$this->model_checkout_order->addOrderHistory($parsed_data['order_id'], $this->config->get('payment_liqpay_order_status_id'));
		}
	}
}