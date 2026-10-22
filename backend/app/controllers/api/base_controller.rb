class Api::BaseController < ActionController::API
  before_action :require_login

  private

  def current_member
    @current_member ||= Member.find_by(id: session[:member_id]) if session[:member_id]
  end

  def require_login
    unless current_member
      render json: { error: "Please log in" }, status: :unauthorized
    end
  end

  def require_admin
    return true if current_member&.role == "admin"

    render json: { error: "Admin access required" }, status: :forbidden
    false
  end
end
